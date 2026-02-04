// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title IdentityRegistry
 * @dev Manages user identities and data vault references for BCI data
 * @notice This contract enables users to register their BCI data vaults and manage access grants
 */
contract IdentityRegistry is Ownable, ReentrancyGuard {
    
    struct UserProfile {
        bytes32 publicKeyHash;      // Hash of user's public key for privacy
        string dataVaultCID;        // IPFS CID of encrypted data vault
        string encryptionKeyCID;    // IPFS CID of encrypted encryption key
        uint256 registeredAt;       // Registration timestamp
        bool active;                // Account status
    }
    
    struct AccessGrant {
        uint256 grantedAt;          // When access was granted
        uint256 expiresAt;          // When access expires
        bool revoked;               // Revocation status
        uint256 compensationAmount; // Payment amount in wei
        string purpose;             // Research purpose description
    }
    
    // Mappings
    mapping(address => UserProfile) public userProfiles;
    mapping(bytes32 => AccessGrant) public accessGrants;
    
    // Events
    event UserRegistered(
        address indexed user,
        string dataVaultCID,
        uint256 timestamp
    );
    
    event AccessGranted(
        address indexed dataOwner,
        address indexed researcher,
        string dataCategory,
        uint256 expiresAt,
        uint256 compensation
    );
    
    event AccessRevoked(
        address indexed dataOwner,
        address indexed researcher,
        string dataCategory,
        uint256 timestamp
    );
    
    event VaultUpdated(
        address indexed user,
        string newCID,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyRegistered() {
        require(userProfiles[msg.sender].active, "User not registered");
        _;
    }
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Register a new user with their data vault information
     * @param _publicKeyHash Hash of user's public key for encryption
     * @param _vaultCID IPFS CID of the encrypted data vault
     * @param _keyCID IPFS CID of the encryption key (encrypted)
     */
    function registerUser(
        bytes32 _publicKeyHash,
        string calldata _vaultCID,
        string calldata _keyCID
    ) external {
        require(!userProfiles[msg.sender].active, "User already registered");
        require(_publicKeyHash != bytes32(0), "Invalid public key hash");
        require(bytes(_vaultCID).length > 0, "Invalid vault CID");
        require(bytes(_keyCID).length > 0, "Invalid key CID");
        
        userProfiles[msg.sender] = UserProfile({
            publicKeyHash: _publicKeyHash,
            dataVaultCID: _vaultCID,
            encryptionKeyCID: _keyCID,
            registeredAt: block.timestamp,
            active: true
        });
        
        emit UserRegistered(msg.sender, _vaultCID, block.timestamp);
    }
    
    /**
     * @dev Grant access to a researcher for a specific data category
     * @param _researcher Address of the researcher
     * @param _dataCategory Category of data being shared (e.g., "EEG", "fMRI")
     * @param _duration Duration of access in seconds
     * @param _compensation Compensation amount in wei
     * @param _purpose Research purpose description
     */
    function grantAccess(
        address _researcher,
        string calldata _dataCategory,
        uint256 _duration,
        uint256 _compensation,
        string calldata _purpose
    ) external onlyRegistered {
        require(userProfiles[_researcher].active, "Researcher not registered");
        require(_duration > 0, "Duration must be positive");
        require(bytes(_dataCategory).length > 0, "Invalid data category");
        require(bytes(_purpose).length > 0, "Purpose required");
        
        bytes32 grantKey = _getGrantKey(msg.sender, _researcher, _dataCategory);
        
        accessGrants[grantKey] = AccessGrant({
            grantedAt: block.timestamp,
            expiresAt: block.timestamp + _duration,
            revoked: false,
            compensationAmount: _compensation,
            purpose: _purpose
        });
        
        emit AccessGranted(
            msg.sender,
            _researcher,
            _dataCategory,
            block.timestamp + _duration,
            _compensation
        );
    }
    
    /**
     * @dev Revoke access for a researcher
     * @param _researcher Address of the researcher
     * @param _dataCategory Category of data
     */
    function revokeAccess(
        address _researcher,
        string calldata _dataCategory
    ) external onlyRegistered {
        bytes32 grantKey = _getGrantKey(msg.sender, _researcher, _dataCategory);
        require(accessGrants[grantKey].grantedAt > 0, "Grant not found");
        require(!accessGrants[grantKey].revoked, "Already revoked");
        
        accessGrants[grantKey].revoked = true;
        
        emit AccessRevoked(msg.sender, _researcher, _dataCategory, block.timestamp);
    }
    
    /**
     * @dev Update the data vault CID
     * @param _newCID New IPFS CID
     */
    function updateVaultCID(string calldata _newCID) external onlyRegistered {
        require(bytes(_newCID).length > 0, "Invalid CID");
        
        userProfiles[msg.sender].dataVaultCID = _newCID;
        emit VaultUpdated(msg.sender, _newCID, block.timestamp);
    }
    
    /**
     * @dev Update the encryption key CID
     * @param _newKeyCID New encryption key CID
     */
    function updateEncryptionKeyCID(string calldata _newKeyCID) external onlyRegistered {
        require(bytes(_newKeyCID).length > 0, "Invalid key CID");
        
        userProfiles[msg.sender].encryptionKeyCID = _newKeyCID;
    }
    
    /**
     * @dev Check if access is currently valid
     * @param _owner Data owner address
     * @param _researcher Researcher address
     * @param _dataCategory Data category
     * @return bool True if access is valid
     */
    function isAccessValid(
        address _owner,
        address _researcher,
        string calldata _dataCategory
    ) external view returns (bool) {
        bytes32 grantKey = _getGrantKey(_owner, _researcher, _dataCategory);
        AccessGrant memory grant = accessGrants[grantKey];
        
        return !grant.revoked && block.timestamp <= grant.expiresAt;
    }
    
    /**
     * @dev Get user profile
     * @param _user User address
     * @return UserProfile struct
     */
    function getUserProfile(address _user) external view returns (UserProfile memory) {
        return userProfiles[_user];
    }
    
    /**
     * @dev Get access grant details
     * @param _owner Data owner address
     * @param _researcher Researcher address
     * @param _dataCategory Data category
     * @return AccessGrant struct
     */
    function getAccessGrant(
        address _owner,
        address _researcher,
        string calldata _dataCategory
    ) external view returns (AccessGrant memory) {
        bytes32 grantKey = _getGrantKey(_owner, _researcher, _dataCategory);
        return accessGrants[grantKey];
    }
    
    /**
     * @dev Deactivate user account (can be reactivated)
     */
    function deactivateAccount() external onlyRegistered {
        userProfiles[msg.sender].active = false;
    }
    
    /**
     * @dev Reactivate user account
     */
    function reactivateAccount() external {
        require(userProfiles[msg.sender].registeredAt > 0, "User never registered");
        require(!userProfiles[msg.sender].active, "Already active");
        
        userProfiles[msg.sender].active = true;
    }
    
    /**
     * @dev Internal function to generate grant key
     */
    function _getGrantKey(
        address _owner,
        address _researcher,
        string calldata _dataCategory
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_owner, _researcher, _dataCategory));
    }
}
