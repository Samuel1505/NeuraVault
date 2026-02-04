// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ConsentManager
 * @dev Manages granular consent preferences for BCI data
 * @notice Allows users to set consent levels and researchers to request access
 */
contract ConsentManager is Ownable {
    
    // Consent levels
    enum ConsentLevel {
        NONE,           // No consent given
        ANONYMIZED,     // Only anonymized data
        AGGREGATED,     // Aggregated statistics only
        RAW             // Raw data access
    }
    
    struct ConsentPreference {
        ConsentLevel consentLevel;      // Level of consent
        uint256 maxDurationBlocks;      // Maximum duration in blocks
        uint256 minCompensation;        // Minimum compensation required
        bool autoApprove;               // Auto-approve matching requests
        uint256 updatedAt;              // Last update timestamp
        uint256 purposeCount;           // Number of purposes
    }
    
    // Mapping for allowed purposes (prefKey => index => purpose)
    mapping(bytes32 => mapping(uint256 => string)) private allowedPurposes;
    
    struct ConsentLog {
        string dataType;                // Type of data requested
        ConsentLevel consentLevel;      // Consent level requested
        string purpose;                 // Research purpose
        bool approved;                  // Approval status
        uint256 timestamp;              // Request timestamp
    }
    
    // Mappings
    mapping(bytes32 => ConsentPreference) public consentPreferences;
    mapping(bytes32 => ConsentLog) public consentLogs;
    
    uint256 private nextRequestId;
    
    // Events
    event ConsentPreferenceSet(
        address indexed user,
        string dataType,
        ConsentLevel level,
        uint256 timestamp
    );
    
    event ConsentRequested(
        address indexed dataOwner,
        address indexed researcher,
        uint256 indexed requestId,
        string dataType,
        ConsentLevel level
    );
    
    event ConsentApproved(
        address indexed dataOwner,
        address indexed researcher,
        uint256 indexed requestId,
        uint256 timestamp
    );
    
    event ConsentDenied(
        address indexed dataOwner,
        address indexed researcher,
        uint256 indexed requestId,
        uint256 timestamp
    );
    
    constructor() Ownable(msg.sender) {
        nextRequestId = 1;
    }
    
    /**
     * @dev Set consent preference for a data type
     * @param _dataType Type of data (e.g., "EEG", "fMRI")
     * @param _level Consent level
     * @param _purposes Allowed research purposes
     * @param _maxDuration Maximum duration in blocks
     * @param _minComp Minimum compensation in wei
     * @param _autoApprove Whether to auto-approve matching requests
     */
    function setConsentPreference(
        string calldata _dataType,
        ConsentLevel _level,
        string[] calldata _purposes,
        uint256 _maxDuration,
        uint256 _minComp,
        bool _autoApprove
    ) external {
        require(_level <= ConsentLevel.RAW, "Invalid consent level");
        require(bytes(_dataType).length > 0, "Invalid data type");
        require(_purposes.length > 0, "At least one purpose required");
        
        bytes32 prefKey = _getPreferenceKey(msg.sender, _dataType);
        
        ConsentPreference storage pref = consentPreferences[prefKey];
        pref.consentLevel = _level;
        pref.maxDurationBlocks = _maxDuration;
        pref.minCompensation = _minComp;
        pref.autoApprove = _autoApprove;
        pref.updatedAt = block.timestamp;
        pref.purposeCount = _purposes.length;
        
        // Store purposes in mapping
        for (uint256 i = 0; i < _purposes.length; i++) {
            allowedPurposes[prefKey][i] = _purposes[i];
        }
        
        emit ConsentPreferenceSet(msg.sender, _dataType, _level, block.timestamp);
    }
    
    /**
     * @dev Request consent from a data owner
     * @param _dataOwner Address of data owner
     * @param _dataType Type of data requested
     * @param _level Consent level requested
     * @param _purpose Research purpose
     * @return requestId The ID of the consent request
     */
    function requestConsent(
        address _dataOwner,
        string calldata _dataType,
        ConsentLevel _level,
        string calldata _purpose
    ) external returns (uint256) {
        require(_dataOwner != address(0), "Invalid data owner");
        require(_dataOwner != msg.sender, "Cannot request from self");
        require(bytes(_dataType).length > 0, "Invalid data type");
        require(bytes(_purpose).length > 0, "Purpose required");
        
        uint256 requestId = nextRequestId++;
        
        bytes32 logKey = _getLogKey(_dataOwner, msg.sender, requestId);
        
        consentLogs[logKey] = ConsentLog({
            dataType: _dataType,
            consentLevel: _level,
            purpose: _purpose,
            approved: false,
            timestamp: block.timestamp
        });
        
        emit ConsentRequested(_dataOwner, msg.sender, requestId, _dataType, _level);
        
        // Check for auto-approval
        bytes32 prefKey = _getPreferenceKey(_dataOwner, _dataType);
        ConsentPreference storage pref = consentPreferences[prefKey];
        
        if (pref.autoApprove && _level <= pref.consentLevel) {
            consentLogs[logKey].approved = true;
            emit ConsentApproved(_dataOwner, msg.sender, requestId, block.timestamp);
        }
        
        return requestId;
    }
    
    /**
     * @dev Approve a consent request
     * @param _researcher Address of researcher
     * @param _requestId Request ID to approve
     */
    function approveConsentRequest(
        address _researcher,
        uint256 _requestId
    ) external {
        bytes32 logKey = _getLogKey(msg.sender, _researcher, _requestId);
        require(consentLogs[logKey].timestamp > 0, "Request not found");
        require(!consentLogs[logKey].approved, "Already approved");
        
        consentLogs[logKey].approved = true;
        
        emit ConsentApproved(msg.sender, _researcher, _requestId, block.timestamp);
    }
    
    /**
     * @dev Deny a consent request
     * @param _researcher Address of researcher
     * @param _requestId Request ID to deny
     */
    function denyConsentRequest(
        address _researcher,
        uint256 _requestId
    ) external {
        bytes32 logKey = _getLogKey(msg.sender, _researcher, _requestId);
        require(consentLogs[logKey].timestamp > 0, "Request not found");
        require(!consentLogs[logKey].approved, "Already approved");
        
        emit ConsentDenied(msg.sender, _researcher, _requestId, block.timestamp);
    }
    
    /**
     * @dev Revoke consent preference for a data type
     * @param _dataType Data type to revoke
     */
    function revokeConsentPreference(string calldata _dataType) external {
        bytes32 prefKey = _getPreferenceKey(msg.sender, _dataType);
        require(consentPreferences[prefKey].updatedAt > 0, "Preference not found");
        
        consentPreferences[prefKey].consentLevel = ConsentLevel.NONE;
        consentPreferences[prefKey].updatedAt = block.timestamp;
        
        emit ConsentPreferenceSet(msg.sender, _dataType, ConsentLevel.NONE, block.timestamp);
    }
    
    /**
     * @dev Get consent preference
     * @param _user User address
     * @param _dataType Data type
     * @return ConsentPreference struct
     */
    function getConsentPreference(
        address _user,
        string calldata _dataType
    ) external view returns (ConsentPreference memory) {
        bytes32 prefKey = _getPreferenceKey(_user, _dataType);
        return consentPreferences[prefKey];
    }
    
    /**
     * @dev Get allowed purposes for a consent preference
     * @param _user User address
     * @param _dataType Data type
     * @return string[] Array of allowed purposes
     */
    function getAllowedPurposes(
        address _user,
        string calldata _dataType
    ) external view returns (string[] memory) {
        bytes32 prefKey = _getPreferenceKey(_user, _dataType);
        uint256 count = consentPreferences[prefKey].purposeCount;
        
        string[] memory purposes = new string[](count);
        for (uint256 i = 0; i < count; i++) {
            purposes[i] = allowedPurposes[prefKey][i];
        }
        
        return purposes;
    }
    
    /**
     * @dev Get consent log
     * @param _owner Data owner address
     * @param _researcher Researcher address
     * @param _requestId Request ID
     * @return ConsentLog struct
     */
    function getConsentLog(
        address _owner,
        address _researcher,
        uint256 _requestId
    ) external view returns (ConsentLog memory) {
        bytes32 logKey = _getLogKey(_owner, _researcher, _requestId);
        return consentLogs[logKey];
    }
    
    /**
     * @dev Check if a consent request is approved
     * @param _owner Data owner address
     * @param _researcher Researcher address
     * @param _requestId Request ID
     * @return bool True if approved
     */
    function isConsentApproved(
        address _owner,
        address _researcher,
        uint256 _requestId
    ) external view returns (bool) {
        bytes32 logKey = _getLogKey(_owner, _researcher, _requestId);
        return consentLogs[logKey].approved;
    }
    
    /**
     * @dev Get the next request ID
     * @return uint256 Next request ID
     */
    function getNextRequestId() external view returns (uint256) {
        return nextRequestId;
    }
    
    /**
     * @dev Internal function to generate preference key
     */
    function _getPreferenceKey(
        address _user,
        string calldata _dataType
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_user, _dataType));
    }
    
    /**
     * @dev Internal function to generate log key
     */
    function _getLogKey(
        address _owner,
        address _researcher,
        uint256 _requestId
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_owner, _researcher, _requestId));
    }
}
