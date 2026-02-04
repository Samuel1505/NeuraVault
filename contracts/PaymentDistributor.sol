// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PaymentDistributor
 * @dev Handles compensation for BCI data access with escrow functionality
 * @notice Enables secure payment handling between data owners and researchers
 */
contract PaymentDistributor is Ownable, ReentrancyGuard {
    
    struct PaymentAgreement {
        uint256 amount;             // Payment amount in wei
        bool paid;                  // Payment completion status
        bool escrowed;              // Escrow status
        bool released;              // Release status
        uint256 createdAt;          // Creation timestamp
        uint256 releaseTime;        // Earliest release time (for time-locks)
    }
    
    // Mappings
    mapping(bytes32 => PaymentAgreement) public paymentAgreements;
    
    uint256 private nextAgreementId;
    uint256 public platformFeePercent = 250; // 2.5% platform fee (basis points)
    uint256 public constant MAX_FEE_PERCENT = 1000; // 10% maximum fee
    address public feeCollector;
    
    // Events
    event AgreementCreated(
        address indexed dataOwner,
        address indexed researcher,
        uint256 indexed agreementId,
        uint256 amount
    );
    
    event PaymentEscrowed(
        address indexed dataOwner,
        address indexed researcher,
        uint256 indexed agreementId,
        uint256 amount
    );
    
    event PaymentReleased(
        address indexed dataOwner,
        address indexed researcher,
        uint256 indexed agreementId,
        uint256 amount,
        uint256 fee
    );
    
    event PaymentRefunded(
        address indexed researcher,
        uint256 indexed agreementId,
        uint256 amount
    );
    
    event FeeUpdated(uint256 newFeePercent);
    event FeeCollectorUpdated(address newCollector);
    
    constructor() Ownable(msg.sender) {
        nextAgreementId = 1;
        feeCollector = msg.sender;
    }
    
    /**
     * @dev Create a payment agreement
     * @param _dataOwner Address of data owner
     * @param _amount Payment amount in wei
     * @param _releaseDelay Optional delay before payment can be released (in seconds)
     * @return agreementId The ID of the created agreement
     */
    function createPaymentAgreement(
        address _dataOwner,
        uint256 _amount,
        uint256 _releaseDelay
    ) external returns (uint256) {
        require(_amount > 0, "Amount must be positive");
        require(_dataOwner != address(0), "Invalid data owner address");
        require(_dataOwner != msg.sender, "Cannot create agreement with self");
        
        uint256 agreementId = nextAgreementId++;
        bytes32 agreementKey = _getAgreementKey(_dataOwner, msg.sender, agreementId);
        
        paymentAgreements[agreementKey] = PaymentAgreement({
            amount: _amount,
            paid: false,
            escrowed: false,
            released: false,
            createdAt: block.timestamp,
            releaseTime: block.timestamp + _releaseDelay
        });
        
        emit AgreementCreated(_dataOwner, msg.sender, agreementId, _amount);
        
        return agreementId;
    }
    
    /**
     * @dev Escrow payment for an agreement
     * @param _dataOwner Address of data owner
     * @param _agreementId Agreement ID
     */
    function escrowPayment(
        address _dataOwner,
        uint256 _agreementId
    ) external payable nonReentrant {
        bytes32 agreementKey = _getAgreementKey(_dataOwner, msg.sender, _agreementId);
        PaymentAgreement storage agreement = paymentAgreements[agreementKey];
        
        require(agreement.createdAt > 0, "Agreement not found");
        require(!agreement.escrowed, "Already escrowed");
        require(msg.value == agreement.amount, "Incorrect payment amount");
        
        agreement.escrowed = true;
        
        emit PaymentEscrowed(_dataOwner, msg.sender, _agreementId, msg.value);
    }
    
    /**
     * @dev Release escrowed payment to data owner
     * @param _researcher Address of researcher
     * @param _agreementId Agreement ID
     */
    function releasePayment(
        address _researcher,
        uint256 _agreementId
    ) external nonReentrant {
        bytes32 agreementKey = _getAgreementKey(msg.sender, _researcher, _agreementId);
        PaymentAgreement storage agreement = paymentAgreements[agreementKey];
        
        require(agreement.createdAt > 0, "Agreement not found");
        require(agreement.escrowed, "Payment not escrowed");
        require(!agreement.released, "Already released");
        require(block.timestamp >= agreement.releaseTime, "Release time not reached");
        
        agreement.released = true;
        agreement.paid = true;
        
        // Calculate platform fee
        uint256 fee = (agreement.amount * platformFeePercent) / 10000;
        uint256 paymentAmount = agreement.amount - fee;
        
        // Transfer payment to data owner
        (bool successOwner, ) = payable(msg.sender).call{value: paymentAmount}("");
        require(successOwner, "Transfer to owner failed");
        
        // Transfer fee to platform
        if (fee > 0) {
            (bool successFee, ) = payable(feeCollector).call{value: fee}("");
            require(successFee, "Fee transfer failed");
        }
        
        emit PaymentReleased(msg.sender, _researcher, _agreementId, paymentAmount, fee);
    }
    
    /**
     * @dev Refund escrowed payment to researcher (mutual agreement or timeout)
     * @param _dataOwner Address of data owner
     * @param _agreementId Agreement ID
     */
    function refundPayment(
        address _dataOwner,
        uint256 _agreementId
    ) external nonReentrant {
        bytes32 agreementKey = _getAgreementKey(_dataOwner, msg.sender, _agreementId);
        PaymentAgreement storage agreement = paymentAgreements[agreementKey];
        
        require(agreement.createdAt > 0, "Agreement not found");
        require(agreement.escrowed, "Payment not escrowed");
        require(!agreement.released, "Already released");
        
        // Only allow refund if data owner agrees or after 30 days timeout
        require(
            msg.sender == _dataOwner || block.timestamp > agreement.createdAt + 30 days,
            "Refund not authorized"
        );
        
        agreement.released = true;
        
        (bool success, ) = payable(msg.sender).call{value: agreement.amount}("");
        require(success, "Refund failed");
        
        emit PaymentRefunded(msg.sender, _agreementId, agreement.amount);
    }
    
    /**
     * @dev Batch release multiple payments (gas optimization)
     * @param _researchers Array of researcher addresses
     * @param _agreementIds Array of agreement IDs
     */
    function batchReleasePayments(
        address[] calldata _researchers,
        uint256[] calldata _agreementIds
    ) external nonReentrant {
        require(_researchers.length == _agreementIds.length, "Array length mismatch");
        require(_researchers.length > 0, "Empty arrays");
        
        for (uint256 i = 0; i < _researchers.length; i++) {
            bytes32 agreementKey = _getAgreementKey(msg.sender, _researchers[i], _agreementIds[i]);
            PaymentAgreement storage agreement = paymentAgreements[agreementKey];
            
            if (agreement.escrowed && !agreement.released && block.timestamp >= agreement.releaseTime) {
                agreement.released = true;
                agreement.paid = true;
                
                uint256 fee = (agreement.amount * platformFeePercent) / 10000;
                uint256 paymentAmount = agreement.amount - fee;
                
                (bool successOwner, ) = payable(msg.sender).call{value: paymentAmount}("");
                require(successOwner, "Batch transfer failed");
                
                if (fee > 0) {
                    (bool successFee, ) = payable(feeCollector).call{value: fee}("");
                    require(successFee, "Batch fee transfer failed");
                }
                
                emit PaymentReleased(msg.sender, _researchers[i], _agreementIds[i], paymentAmount, fee);
            }
        }
    }
    
    /**
     * @dev Update platform fee (only owner)
     * @param _newFeePercent New fee percentage in basis points
     */
    function updatePlatformFee(uint256 _newFeePercent) external onlyOwner {
        require(_newFeePercent <= MAX_FEE_PERCENT, "Fee too high");
        platformFeePercent = _newFeePercent;
        emit FeeUpdated(_newFeePercent);
    }
    
    /**
     * @dev Update fee collector address (only owner)
     * @param _newCollector New fee collector address
     */
    function updateFeeCollector(address _newCollector) external onlyOwner {
        require(_newCollector != address(0), "Invalid collector address");
        feeCollector = _newCollector;
        emit FeeCollectorUpdated(_newCollector);
    }
    
    /**
     * @dev Get payment agreement details
     * @param _dataOwner Data owner address
     * @param _researcher Researcher address
     * @param _agreementId Agreement ID
     * @return PaymentAgreement struct
     */
    function getPaymentAgreement(
        address _dataOwner,
        address _researcher,
        uint256 _agreementId
    ) external view returns (PaymentAgreement memory) {
        bytes32 agreementKey = _getAgreementKey(_dataOwner, _researcher, _agreementId);
        return paymentAgreements[agreementKey];
    }
    
    /**
     * @dev Check if payment can be released
     * @param _dataOwner Data owner address
     * @param _researcher Researcher address
     * @param _agreementId Agreement ID
     * @return bool True if payment can be released
     */
    function canReleasePayment(
        address _dataOwner,
        address _researcher,
        uint256 _agreementId
    ) external view returns (bool) {
        bytes32 agreementKey = _getAgreementKey(_dataOwner, _researcher, _agreementId);
        PaymentAgreement memory agreement = paymentAgreements[agreementKey];
        
        return agreement.escrowed && 
               !agreement.released && 
               block.timestamp >= agreement.releaseTime;
    }
    
    /**
     * @dev Get the next agreement ID
     * @return uint256 Next agreement ID
     */
    function getNextAgreementId() external view returns (uint256) {
        return nextAgreementId;
    }
    
    /**
     * @dev Internal function to generate agreement key
     */
    function _getAgreementKey(
        address _dataOwner,
        address _researcher,
        uint256 _agreementId
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_dataOwner, _researcher, _agreementId));
    }
    
    /**
     * @dev Emergency withdraw function (only owner, only if no active escrows)
     * @notice This should only be used in extreme circumstances
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Emergency withdraw failed");
    }
}
