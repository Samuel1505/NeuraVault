# Neural Privacy Layer – BCI Data Sovereignty Protocol
## Technical Architecture Document

---

## Executive Summary

A decentralized infrastructure enabling individuals to maintain sovereign control over their brain-computer interface (BCI) data while allowing privacy-preserving research collaboration. This project addresses the intersection of Neurotechnology, Digital Human Rights, and AI/AGI for the PL_Genesis hackathon.

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Solution Overview](#solution-overview)
3. [System Architecture](#system-architecture)
4. [Core Components](#core-components)
5. [Technology Stack](#technology-stack)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Setup Instructions](#setup-instructions)
8. [Security Considerations](#security-considerations)
9. [Future Enhancements](#future-enhancements)

---

## Problem Statement

With companies like Neuralink and Synchron advancing clinical BCI trials, neural data privacy has become critical. Current systems store BCI data in centralized databases controlled by corporations or research institutions. 

**Key Issues:**
- Patients lack control over who accesses their neural recordings
- No transparency in how data is used
- Cannot monetize contributions to research
- Serious ethical concerns around neural data ownership and consent
- Risk of neural data breaches and unauthorized access
- No standardized consent mechanisms for neural data sharing

---

## Solution Overview

The Neural Privacy Layer creates a decentralized, privacy-preserving infrastructure that:

1. **Data Sovereignty**: Users maintain cryptographic control over their BCI data
2. **Privacy-Preserving Research**: Enable research collaboration without exposing raw neural data
3. **Consent Management**: Granular, revocable consent mechanisms
4. **Data Monetization**: Fair compensation for data contributions
5. **Interoperability**: Standard protocols for BCI data exchange
6. **Auditability**: Transparent, immutable access logs

---

## System Architecture

```mermaid
graph TB
    subgraph "User Layer"
        BCI[BCI Device]
        LocalNode[Local Privacy Node]
        Wallet[Identity Wallet]
    end
    
    subgraph "Decentralized Storage Layer"
        IPFS[IPFS/Filecoin]
        Encryption[End-to-End Encryption]
    end
    
    subgraph "Blockchain Layer"
        SmartContracts[Smart Contracts]
        AccessControl[Access Control Registry]
        ConsentLog[Consent Ledger]
        Payments[Payment Distribution]
    end
    
    subgraph "Privacy Layer"
        ZKP[Zero-Knowledge Proofs]
        FHE[Federated Learning Engine]
        DifferentialPrivacy[Differential Privacy Module]
    end
    
    subgraph "Research Layer"
        ResearchPortal[Research Portal]
        DataMarketplace[Data Marketplace]
        Analytics[Privacy-Preserving Analytics]
    end
    
    BCI --> LocalNode
    LocalNode --> Encryption
    Encryption --> IPFS
    LocalNode --> Wallet
    Wallet --> SmartContracts
    SmartContracts --> AccessControl
    SmartContracts --> ConsentLog
    SmartContracts --> Payments
    IPFS --> ZKP
    ZKP --> FHE
    FHE --> Analytics
    AccessControl --> ResearchPortal
    ConsentLog --> DataMarketplace
    Analytics --> ResearchPortal
```

---

## Core Components

### 1. Local Privacy Node

**Purpose**: Edge computing node that processes BCI data locally before any external transmission.

**Features:**
- Real-time BCI data ingestion
- Local preprocessing and anonymization
- Encryption key management
- Selective data sharing controls
- Offline-first architecture

**Technology:**
- Rust or Go for performance
- SQLite for local metadata storage
- libsodium for cryptography

---

### 2. Decentralized Storage Layer

**Purpose**: Store encrypted BCI data in a distributed, censorship-resistant manner.

**Components:**

#### IPFS/Filecoin Integration
- Content-addressed storage for immutability
- Redundant storage across multiple nodes
- Cryptographic verification of data integrity

#### Encryption Strategy
- **At-Rest**: AES-256-GCM encryption
- **In-Transit**: TLS 1.3
- **Key Management**: Hierarchical Deterministic (HD) key derivation
- **Access Keys**: Proxy re-encryption for selective sharing

---

### 3. Blockchain Layer (Smart Contracts)

**Purpose**: Manage access control, consent, and payments in a transparent, auditable manner.

#### Smart Contract Modules

##### a) Identity & Access Control Contract
```clarity
;; Pseudo-code structure
(define-map user-identities 
  { user-id: principal }
  { 
    public-key: (buff 33),
    data-vault-cid: (string-ascii 64),
    created-at: uint
  }
)

(define-map access-grants
  { 
    data-owner: principal,
    researcher: principal,
    data-type: (string-ascii 32)
  }
  {
    granted-at: uint,
    expires-at: uint,
    revoked: bool,
    compensation: uint
  }
)
```

##### b) Consent Management Contract
- Granular consent levels (raw data, aggregated, anonymized)
- Time-bound permissions
- Purpose-specific access
- Revocation mechanisms

##### c) Payment Distribution Contract
- Automated micropayments for data access
- Escrow for research agreements
- Revenue sharing for data contributions
- Staking mechanisms for researchers

##### d) Data Provenance Contract
- Immutable audit trail
- Access logs
- Data lineage tracking
- Compliance verification

---

### 4. Privacy-Preserving Computation Layer

#### Zero-Knowledge Proofs (ZKP)
**Use Cases:**
- Prove data characteristics without revealing raw data
- Verify consent without exposing identity
- Demonstrate compliance with research protocols

**Implementation:**
- zk-SNARKs for compact proofs
- Circom for circuit design
- SnarkJS for proof generation/verification

#### Federated Learning
**Purpose**: Train AI models on distributed BCI data without centralization.

**Architecture:**
- Local model training on user devices
- Encrypted gradient aggregation
- Differential privacy guarantees
- Byzantine-fault tolerance

**Technology:**
- TensorFlow Federated or PySyft
- Secure aggregation protocols

#### Differential Privacy
**Purpose**: Add mathematical privacy guarantees to aggregated statistics.

**Parameters:**
- ε (epsilon): Privacy budget
- δ (delta): Failure probability
- Laplace/Gaussian noise mechanisms

---

### 5. Research Portal & Data Marketplace

**Features:**
- Discovery of available datasets (metadata only)
- Request access with research proposals
- Automated consent matching
- Payment negotiation
- Privacy-preserving analytics dashboard

**User Flows:**

1. **Data Owner Flow:**
   - Register BCI device
   - Set consent preferences
   - Monitor access requests
   - Receive compensation

2. **Researcher Flow:**
   - Browse available data types
   - Submit research proposal
   - Negotiate terms
   - Access privacy-preserving analytics
   - Publish findings with attribution

---

## Technology Stack

### Backend Infrastructure

> **💡 Note**: While this document uses **Rust** for the backend implementation, you can use **any backend language** you prefer. See [BACKEND_ALTERNATIVES.md](./BACKEND_ALTERNATIVES.md) for complete implementations in:
> - **Node.js/TypeScript** (fastest development, largest ecosystem)
> - **Python (FastAPI)** (best for ML/AI integration)
> - **Go** (excellent for microservices)
> - **Rust** (maximum performance and security)

| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Blockchain** | Ethereum/Polygon | Mature ecosystem, EVM compatibility, large developer community |
| **Layer 2** | Arbitrum/Optimism | Lower gas fees, faster transactions |
| **Storage** | IPFS + Filecoin | Decentralized, content-addressed, incentivized |
| **Privacy Layer** | zk-SNARKs (Circom) | Compact proofs, efficient verification |
| **Federated Learning** | PySyft | Privacy-preserving ML, active development |
| **Backend (All Rust)** | Rust + Axum | Performance, memory safety, cryptography support, async runtime |
| **Database** | PostgreSQL + SQLx | Reliable, type-safe queries with compile-time verification |

### Frontend

| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Web App** | React + TypeScript | Type safety, component reusability |
| **State Management** | Zustand/Redux | Predictable state, dev tools |
| **Web3 Integration** | Ethers.js / Wagmi | Wallet connection, contract interaction, React hooks |
| **UI Framework** | Tailwind CSS + shadcn/ui | Modern design, accessibility |
| **Data Visualization** | D3.js / Recharts | Privacy-preserving analytics display |

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

#### Week 1: Setup & Core Infrastructure

**Day 1-2: Project Setup**
- [ ] Initialize Git repository
- [ ] Set up monorepo structure (contracts, backend, frontend)
- [ ] Configure development environment
- [ ] Set up CI/CD pipelines

**Day 3-4: Smart Contract Development**
- [ ] Design contract architecture
- [ ] Implement Identity & Access Control contract
- [ ] Implement Consent Management contract
- [ ] Write unit tests for contracts

**Day 5-7: Local Privacy Node (MVP)**
- [ ] Set up Rust project structure
- [ ] Implement BCI data ingestion (mock data initially)
- [ ] Implement local encryption
- [ ] Implement IPFS integration for storage

#### Week 2: Privacy Layer & Storage

**Day 8-10: Privacy-Preserving Computation**
- [ ] Implement basic ZKP circuit for data verification
- [ ] Set up differential privacy module
- [ ] Create privacy budget management system

**Day 11-12: Decentralized Storage**
- [ ] Configure Filecoin storage deals
- [ ] Implement encrypted data upload/retrieval
- [ ] Create metadata indexing system

**Day 13-14: Payment System**
- [ ] Implement Payment Distribution contract
- [ ] Create escrow mechanism
- [ ] Test payment flows

---

### Phase 2: User Interfaces (Weeks 3-4)

#### Week 3: Data Owner Portal

**Day 15-17: Core UI**
- [ ] Set up React application
- [ ] Implement wallet connection (Stacks/Ethereum)
- [ ] Create dashboard for data owners
- [ ] Build consent management interface

**Day 18-19: Data Management**
- [ ] Implement data upload interface
- [ ] Create access request review system
- [ ] Build earnings dashboard

**Day 20-21: Testing & Refinement**
- [ ] End-to-end testing
- [ ] UI/UX improvements
- [ ] Accessibility audit

#### Week 4: Research Portal

**Day 22-24: Research Interface**
- [ ] Create researcher registration flow
- [ ] Build data discovery interface
- [ ] Implement access request system

**Day 25-26: Analytics Dashboard**
- [ ] Privacy-preserving analytics visualization
- [ ] Federated learning job submission
- [ ] Results display

**Day 27-28: Integration & Testing**
- [ ] Full system integration testing
- [ ] Security audit
- [ ] Performance optimization

---

### Phase 3: Advanced Features (Week 5+)

**Optional Enhancements:**
- [ ] Federated learning implementation
- [ ] Advanced ZKP circuits
- [ ] Mobile application
- [ ] Multi-chain support
- [ ] Governance mechanisms

---

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

```bash
# System Requirements
- Node.js >= 18.x
- Rust >= 1.70
- Docker >= 24.x
- Git >= 2.x

# Blockchain Tools
- Hardhat (for Ethereum development)
- Foundry (optional, for advanced testing)

# Storage
- IPFS Desktop or Kubo CLI
- Filecoin Lotus (optional for production)
```

---

### Step 1: Environment Setup

#### 1.1 Clone Repository

```bash
# Create project directory
mkdir neural-privacy-layer
cd neural-privacy-layer

# Initialize Git
git init

# Create directory structure
mkdir -p contracts/solidity
mkdir -p backend/{privacy-node,api-gateway}
mkdir -p frontend/{data-owner,researcher}
mkdir -p scripts
mkdir -p docs
mkdir -p tests
```

#### 1.2 Install Hardhat (Ethereum Development)

```bash
cd contracts/solidity

# Initialize npm project
npm init -y

# Install Hardhat and dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install --save-dev @openzeppelin/contracts
npm install --save-dev dotenv

# Initialize Hardhat project
npx hardhat init
# Select "Create a TypeScript project"
```

#### 1.3 Configure Hardhat

Create `hardhat.config.ts`:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    arbitrum: {
      url: process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
```

---

### Step 2: Smart Contract Development

#### 2.1 Identity Registry Contract

Create `contracts/IdentityRegistry.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title IdentityRegistry
 * @dev Manages user identities and data vault references for BCI data
 */
contract IdentityRegistry is Ownable, ReentrancyGuard {
    
    struct UserProfile {
        bytes33 publicKey;
        string dataVaultCID;
        string encryptionKeyCID;
        uint256 registeredAt;
        bool active;
    }
    
    struct AccessGrant {
        uint256 grantedAt;
        uint256 expiresAt;
        bool revoked;
        uint256 compensationAmount;
        string purpose;
    }
    
    // Mappings
    mapping(address => UserProfile) public userProfiles;
    mapping(bytes32 => AccessGrant) public accessGrants;
    
    // Events
    event UserRegistered(address indexed user, string dataVaultCID, uint256 timestamp);
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
    event VaultUpdated(address indexed user, string newCID, uint256 timestamp);
    
    // Modifiers
    modifier onlyRegistered() {
        require(userProfiles[msg.sender].active, "User not registered");
        _;
    }
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Register a new user with their data vault information
     * @param _publicKey User's public key for encryption
     * @param _vaultCID IPFS CID of the encrypted data vault
     * @param _keyCID IPFS CID of the encryption key (encrypted)
     */
    function registerUser(
        bytes33 _publicKey,
        string calldata _vaultCID,
        string calldata _keyCID
    ) external {
        require(!userProfiles[msg.sender].active, "User already registered");
        
        userProfiles[msg.sender] = UserProfile({
            publicKey: _publicKey,
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
     * @param _dataCategory Category of data being shared
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
        
        accessGrants[grantKey].revoked = true;
        
        emit AccessRevoked(msg.sender, _researcher, _dataCategory, block.timestamp);
    }
    
    /**
     * @dev Update the data vault CID
     * @param _newCID New IPFS CID
     */
    function updateVaultCID(string calldata _newCID) external onlyRegistered {
        userProfiles[msg.sender].dataVaultCID = _newCID;
        emit VaultUpdated(msg.sender, _newCID, block.timestamp);
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
```

#### 2.2 Consent Manager Contract

Create `contracts/ConsentManager.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ConsentManager
 * @dev Manages granular consent preferences for BCI data
 */
contract ConsentManager is Ownable {
    
    // Consent levels
    enum ConsentLevel {
        NONE,
        ANONYMIZED,
        AGGREGATED,
        RAW
    }
    
    struct ConsentPreference {
        ConsentLevel consentLevel;
        string[] allowedPurposes;
        uint256 maxDurationBlocks;
        uint256 minCompensation;
        bool autoApprove;
        uint256 updatedAt;
    }
    
    struct ConsentLog {
        string dataType;
        ConsentLevel consentLevel;
        string purpose;
        bool approved;
        uint256 timestamp;
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
    
    constructor() Ownable(msg.sender) {
        nextRequestId = 1;
    }
    
    /**
     * @dev Set consent preference for a data type
     * @param _dataType Type of data
     * @param _level Consent level
     * @param _purposes Allowed research purposes
     * @param _maxDuration Maximum duration in blocks
     * @param _minComp Minimum compensation
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
        
        bytes32 prefKey = _getPreferenceKey(msg.sender, _dataType);
        
        ConsentPreference storage pref = consentPreferences[prefKey];
        pref.consentLevel = _level;
        pref.allowedPurposes = _purposes;
        pref.maxDurationBlocks = _maxDuration;
        pref.minCompensation = _minComp;
        pref.autoApprove = _autoApprove;
        pref.updatedAt = block.timestamp;
        
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
        
        consentLogs[logKey].approved = true;
        
        emit ConsentApproved(msg.sender, _researcher, _requestId, block.timestamp);
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
```

#### 2.3 Payment Distributor Contract

Create `contracts/PaymentDistributor.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PaymentDistributor
 * @dev Handles compensation for BCI data access
 */
contract PaymentDistributor is Ownable, ReentrancyGuard {
    
    struct PaymentAgreement {
        uint256 amount;
        bool paid;
        bool escrowed;
        bool released;
        uint256 createdAt;
    }
    
    // Mappings
    mapping(bytes32 => PaymentAgreement) public paymentAgreements;
    
    uint256 private nextAgreementId;
    
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
        uint256 amount
    );
    event PaymentRefunded(
        address indexed researcher,
        uint256 indexed agreementId,
        uint256 amount
    );
    
    constructor() Ownable(msg.sender) {
        nextAgreementId = 1;
    }
    
    /**
     * @dev Create a payment agreement
     * @param _dataOwner Address of data owner
     * @param _amount Payment amount in wei
     * @return agreementId The ID of the created agreement
     */
    function createPaymentAgreement(
        address _dataOwner,
        uint256 _amount
    ) external returns (uint256) {
        require(_amount > 0, "Amount must be positive");
        require(_dataOwner != address(0), "Invalid data owner address");
        
        uint256 agreementId = nextAgreementId++;
        bytes32 agreementKey = _getAgreementKey(_dataOwner, msg.sender, agreementId);
        
        paymentAgreements[agreementKey] = PaymentAgreement({
            amount: _amount,
            paid: false,
            escrowed: false,
            released: false,
            createdAt: block.timestamp
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
        
        agreement.released = true;
        agreement.paid = true;
        
        (bool success, ) = payable(msg.sender).call{value: agreement.amount}("");
        require(success, "Transfer failed");
        
        emit PaymentReleased(msg.sender, _researcher, _agreementId, agreement.amount);
    }
    
    /**
     * @dev Refund escrowed payment to researcher (in case of dispute or cancellation)
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
        
        // Only allow refund if data owner agrees or after timeout
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
     * @dev Internal function to generate agreement key
     */
    function _getAgreementKey(
        address _dataOwner,
        address _researcher,
        uint256 _agreementId
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_dataOwner, _researcher, _agreementId));
    }
}

---

### Step 3: Rust Backend Setup (Complete Backend in Rust)

The backend will be a monolithic Rust application with multiple modules:
- **Privacy Node**: Local data encryption and IPFS storage
- **API Gateway**: REST API for frontend communication
- **Blockchain Client**: Ethereum contract interaction
- **Database**: PostgreSQL for metadata and indexing

#### 3.1 Initialize Rust Workspace

```bash
cd ../../backend
cargo new --name neural-backend .

# Create workspace structure
mkdir -p src/{api,blockchain,storage,encryption,database,models}
```

#### 3.2 Configure Cargo.toml

```toml
[package]
name = "neural-backend"
version = "0.1.0"
edition = "2021"

[dependencies]
# Web Framework
axum = { version = "0.7", features = ["macros"] }
tower = "0.4"
tower-http = { version = "0.5", features = ["cors", "trace"] }
tokio = { version = "1.35", features = ["full"] }

# Serialization
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

# Database
sqlx = { version = "0.7", features = ["postgres", "runtime-tokio-native-tls", "migrate", "chrono", "uuid"] }

# Blockchain (Ethereum)
ethers = { version = "2.0", features = ["abigen", "ws"] }

# IPFS
ipfs-api-backend-hyper = "0.6"

# Cryptography
aes-gcm = "0.10"
sodiumoxide = "0.2"
rand = "0.8"
sha2 = "0.10"
hex = "0.4"

# Utilities
thiserror = "1.0"
anyhow = "1.0"
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter"] }
dotenv = "0.15"
chrono = { version = "0.4", features = ["serde"] }
uuid = { version = "1.6", features = ["serde", "v4"] }

[dev-dependencies]
tempfile = "3.8"
```

#### 3.3 Project Structure

```
backend/
├── Cargo.toml
├── .env
├── migrations/
│   └── 001_initial_schema.sql
└── src/
    ├── main.rs
    ├── api/
    │   ├── mod.rs
    │   ├── routes.rs
    │   ├── handlers.rs
    │   └── middleware.rs
    ├── blockchain/
    │   ├── mod.rs
    │   ├── client.rs
    │   └── contracts.rs
    ├── storage/
    │   ├── mod.rs
    │   └── ipfs.rs
    ├── encryption/
    │   ├── mod.rs
    │   └── service.rs
    ├── database/
    │   ├── mod.rs
    │   └── queries.rs
    ├── models/
    │   ├── mod.rs
    │   ├── user.rs
    │   └── data.rs
    └── config.rs
```

#### 3.4 Core Modules Implementation

**File: `src/config.rs`**

```rust
use std::env;

#[derive(Clone, Debug)]
pub struct Config {
    pub database_url: String,
    pub ipfs_url: String,
    pub ethereum_rpc_url: String,
    pub contract_address: String,
    pub server_port: u16,
}

impl Config {
    pub fn from_env() -> Result<Self, env::VarError> {
        Ok(Self {
            database_url: env::var("DATABASE_URL")?,
            ipfs_url: env::var("IPFS_URL").unwrap_or_else(|_| "http://localhost:5001".to_string()),
            ethereum_rpc_url: env::var("ETHEREUM_RPC_URL")?,
            contract_address: env::var("CONTRACT_ADDRESS")?,
            server_port: env::var("SERVER_PORT")
                .unwrap_or_else(|_| "3000".to_string())
                .parse()
                .unwrap_or(3000),
        })
    }
}
```

**File: `src/models/mod.rs`**

```rust
pub mod user;
pub mod data;

pub use user::*;
pub use data::*;
```

**File: `src/models/user.rs`**

```rust
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: Uuid,
    pub wallet_address: String,
    pub public_key: String,
    pub data_vault_cid: Option<String>,
    pub encryption_key_cid: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateUserRequest {
    pub wallet_address: String,
    pub public_key: String,
    pub data_vault_cid: String,
    pub encryption_key_cid: String,
}
```

**File: `src/models/data.rs`**

```rust
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct DataRecord {
    pub id: Uuid,
    pub user_id: Uuid,
    pub data_type: String,
    pub ipfs_cid: String,
    pub encrypted: bool,
    pub size_bytes: i64,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct UploadDataRequest {
    pub data_type: String,
    pub data: String, // Base64 encoded
}
```

**File: `src/encryption/mod.rs`**

```rust
pub mod service;
pub use service::*;
```

**File: `src/encryption/service.rs`**

```rust
use aes_gcm::{
    aead::{Aead, KeyInit, OsRng},
    Aes256Gcm, Nonce,
};
use rand::RngCore;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum EncryptionError {
    #[error("Encryption failed")]
    EncryptionFailed,
    #[error("Decryption failed")]
    DecryptionFailed,
    #[error("Invalid key")]
    InvalidKey,
}

pub struct EncryptionService {
    cipher: Aes256Gcm,
}

impl EncryptionService {
    pub fn new(key: &[u8; 32]) -> Self {
        let cipher = Aes256Gcm::new(key.into());
        Self { cipher }
    }

    pub fn generate_key() -> [u8; 32] {
        let mut key = [0u8; 32];
        OsRng.fill_bytes(&mut key);
        key
    }

    pub fn encrypt(&self, data: &[u8]) -> Result<Vec<u8>, EncryptionError> {
        let mut nonce_bytes = [0u8; 12];
        OsRng.fill_bytes(&mut nonce_bytes);
        let nonce = Nonce::from_slice(&nonce_bytes);

        let ciphertext = self
            .cipher
            .encrypt(nonce, data)
            .map_err(|_| EncryptionError::EncryptionFailed)?;

        let mut result = nonce_bytes.to_vec();
        result.extend_from_slice(&ciphertext);
        Ok(result)
    }

    pub fn decrypt(&self, encrypted_data: &[u8]) -> Result<Vec<u8>, EncryptionError> {
        if encrypted_data.len() < 12 {
            return Err(EncryptionError::DecryptionFailed);
        }

        let (nonce_bytes, ciphertext) = encrypted_data.split_at(12);
        let nonce = Nonce::from_slice(nonce_bytes);

        self.cipher
            .decrypt(nonce, ciphertext)
            .map_err(|_| EncryptionError::DecryptionFailed)
    }
}
```

**File: `src/storage/mod.rs`**

```rust
pub mod ipfs;
pub use ipfs::*;
```

**File: `src/storage/ipfs.rs`**

```rust
use ipfs_api_backend_hyper::{IpfsApi, IpfsClient, TryFromUri};
use std::io::Cursor;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum StorageError {
    #[error("IPFS connection failed: {0}")]
    ConnectionFailed(String),
    #[error("Upload failed: {0}")]
    UploadFailed(String),
    #[error("Download failed: {0}")]
    DownloadFailed(String),
}

#[derive(Clone)]
pub struct StorageService {
    client: IpfsClient,
}

impl StorageService {
    pub fn new(ipfs_url: &str) -> Result<Self, StorageError> {
        let client = IpfsClient::from_str(ipfs_url)
            .map_err(|e| StorageError::ConnectionFailed(e.to_string()))?;
        Ok(Self { client })
    }

    pub async fn upload(&self, data: Vec<u8>) -> Result<String, StorageError> {
        let cursor = Cursor::new(data);
        let response = self
            .client
            .add(cursor)
            .await
            .map_err(|e| StorageError::UploadFailed(e.to_string()))?;
        Ok(response.hash)
    }

    pub async fn download(&self, cid: &str) -> Result<Vec<u8>, StorageError> {
        use futures::TryStreamExt;
        
        let bytes = self
            .client
            .cat(cid)
            .map_ok(|chunk| chunk.to_vec())
            .try_concat()
            .await
            .map_err(|e| StorageError::DownloadFailed(e.to_string()))?;
        Ok(bytes)
    }
}
```

**File: `src/blockchain/mod.rs`**

```rust
pub mod client;
pub mod contracts;

pub use client::*;
pub use contracts::*;
```

**File: `src/blockchain/client.rs`**

```rust
use ethers::prelude::*;
use std::sync::Arc;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum BlockchainError {
    #[error("Connection failed: {0}")]
    ConnectionFailed(String),
    #[error("Contract call failed: {0}")]
    ContractCallFailed(String),
}

#[derive(Clone)]
pub struct BlockchainClient {
    provider: Arc<Provider<Http>>,
    contract_address: Address,
}

impl BlockchainClient {
    pub async fn new(rpc_url: &str, contract_address: &str) -> Result<Self, BlockchainError> {
        let provider = Provider::<Http>::try_from(rpc_url)
            .map_err(|e| BlockchainError::ConnectionFailed(e.to_string()))?;

        let contract_address = contract_address
            .parse::<Address>()
            .map_err(|e| BlockchainError::ConnectionFailed(e.to_string()))?;

        Ok(Self {
            provider: Arc::new(provider),
            contract_address,
        })
    }

    pub async fn get_user_profile(&self, address: Address) -> Result<bool, BlockchainError> {
        // This is a simplified example
        // In production, you'd use abigen! to generate contract bindings
        Ok(true)
    }

    pub async fn verify_access(
        &self,
        owner: Address,
        researcher: Address,
        data_category: &str,
    ) -> Result<bool, BlockchainError> {
        // Verify access on-chain
        // Use contract bindings to call isAccessValid
        Ok(true)
    }
}
```

**File: `src/database/mod.rs`**

```rust
pub mod queries;
pub use queries::*;

use sqlx::{postgres::PgPoolOptions, PgPool};

pub async fn create_pool(database_url: &str) -> Result<PgPool, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await
}
```

**File: `src/database/queries.rs`**

```rust
use crate::models::{User, DataRecord};
use sqlx::PgPool;
use uuid::Uuid;

pub async fn create_user(
    pool: &PgPool,
    wallet_address: &str,
    public_key: &str,
    data_vault_cid: &str,
    encryption_key_cid: &str,
) -> Result<User, sqlx::Error> {
    sqlx::query_as::<_, User>(
        r#"
        INSERT INTO users (id, wallet_address, public_key, data_vault_cid, encryption_key_cid)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        "#,
    )
    .bind(Uuid::new_v4())
    .bind(wallet_address)
    .bind(public_key)
    .bind(data_vault_cid)
    .bind(encryption_key_cid)
    .fetch_one(pool)
    .await
}

pub async fn get_user_by_wallet(pool: &PgPool, wallet_address: &str) -> Result<User, sqlx::Error> {
    sqlx::query_as::<_, User>("SELECT * FROM users WHERE wallet_address = $1")
        .bind(wallet_address)
        .fetch_one(pool)
        .await
}

pub async fn create_data_record(
    pool: &PgPool,
    user_id: Uuid,
    data_type: &str,
    ipfs_cid: &str,
    size_bytes: i64,
) -> Result<DataRecord, sqlx::Error> {
    sqlx::query_as::<_, DataRecord>(
        r#"
        INSERT INTO data_records (id, user_id, data_type, ipfs_cid, encrypted, size_bytes)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        "#,
    )
    .bind(Uuid::new_v4())
    .bind(user_id)
    .bind(data_type)
    .bind(ipfs_cid)
    .bind(true)
    .bind(size_bytes)
    .fetch_one(pool)
    .await
}

pub async fn get_user_data_records(pool: &PgPool, user_id: Uuid) -> Result<Vec<DataRecord>, sqlx::Error> {
    sqlx::query_as::<_, DataRecord>("SELECT * FROM data_records WHERE user_id = $1 ORDER BY created_at DESC")
        .bind(user_id)
        .fetch_all(pool)
        .await
}
```

**File: `src/api/mod.rs`**

```rust
pub mod routes;
pub mod handlers;
pub mod middleware;

pub use routes::*;
pub use handlers::*;
```

**File: `src/api/handlers.rs`**

```rust
use axum::{
    extract::{State, Json},
    http::StatusCode,
    response::IntoResponse,
};
use serde::{Deserialize, Serialize};
use crate::{
    models::{CreateUserRequest, UploadDataRequest},
    database,
    AppState,
};

#[derive(Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

#[derive(Serialize)]
pub struct UploadResponse {
    pub cid: String,
    pub size: usize,
}

pub async fn health_check() -> impl IntoResponse {
    Json(ApiResponse {
        success: true,
        data: Some("OK"),
        error: None,
    })
}

pub async fn create_user(
    State(state): State<AppState>,
    Json(payload): Json<CreateUserRequest>,
) -> Result<Json<ApiResponse<String>>, StatusCode> {
    let user = database::create_user(
        &state.db,
        &payload.wallet_address,
        &payload.public_key,
        &payload.data_vault_cid,
        &payload.encryption_key_cid,
    )
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(ApiResponse {
        success: true,
        data: Some(user.id.to_string()),
        error: None,
    }))
}

pub async fn upload_data(
    State(state): State<AppState>,
    Json(payload): Json<UploadDataRequest>,
) -> Result<Json<ApiResponse<UploadResponse>>, StatusCode> {
    // Decode base64
    let data = base64::decode(&payload.data).map_err(|_| StatusCode::BAD_REQUEST)?;

    // Encrypt
    let encrypted = state
        .encryption
        .encrypt(&data)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // Upload to IPFS
    let cid = state
        .storage
        .upload(encrypted.clone())
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(ApiResponse {
        success: true,
        data: Some(UploadResponse {
            cid,
            size: encrypted.len(),
        }),
        error: None,
    }))
}
```

**File: `src/api/routes.rs`**

```rust
use axum::{
    routing::{get, post},
    Router,
};
use crate::{api::handlers, AppState};

pub fn create_router(state: AppState) -> Router {
    Router::new()
        .route("/health", get(handlers::health_check))
        .route("/users", post(handlers::create_user))
        .route("/data/upload", post(handlers::upload_data))
        .with_state(state)
}
```

**File: `src/main.rs`**

```rust
mod api;
mod blockchain;
mod config;
mod database;
mod encryption;
mod models;
mod storage;

use axum::Router;
use sqlx::PgPool;
use std::sync::Arc;
use tower_http::cors::CorsLayer;
use tracing::info;

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub encryption: Arc<encryption::EncryptionService>,
    pub storage: storage::StorageService,
    pub blockchain: blockchain::BlockchainClient,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize tracing
    tracing_subscriber::fmt::init();

    // Load configuration
    dotenv::dotenv().ok();
    let config = config::Config::from_env()?;

    // Initialize database
    let db = database::create_pool(&config.database_url).await?;
    
    // Run migrations
    sqlx::migrate!("./migrations").run(&db).await?;

    // Initialize services
    let encryption_key = encryption::EncryptionService::generate_key();
    let encryption_service = Arc::new(encryption::EncryptionService::new(&encryption_key));
    let storage_service = storage::StorageService::new(&config.ipfs_url)?;
    let blockchain_client = blockchain::BlockchainClient::new(
        &config.ethereum_rpc_url,
        &config.contract_address,
    )
    .await?;

    let state = AppState {
        db,
        encryption: encryption_service,
        storage: storage_service,
        blockchain: blockchain_client,
    };

    // Build router
    let app = api::create_router(state)
        .layer(CorsLayer::permissive());

    let addr = format!("0.0.0.0:{}", config.server_port);
    info!("Starting Neural Backend on {}", addr);

    let listener = tokio::net::TcpListener::bind(&addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
```

**File: `migrations/001_initial_schema.sql`**

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    public_key TEXT NOT NULL,
    data_vault_cid TEXT,
    encryption_key_cid TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Data records table
CREATE TABLE IF NOT EXISTS data_records (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    data_type VARCHAR(50) NOT NULL,
    ipfs_cid TEXT NOT NULL,
    encrypted BOOLEAN NOT NULL DEFAULT TRUE,
    size_bytes BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_data_records_user ON data_records(user_id);
CREATE INDEX idx_data_records_type ON data_records(data_type);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**File: `.env.example`**

```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/neural_privacy
IPFS_URL=http://localhost:5001
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
CONTRACT_ADDRESS=0x...
SERVER_PORT=3000
RUST_LOG=info
```

---

### Step 4: IPFS Setup

#### 4.1 Install IPFS

```bash
# Download IPFS Kubo
wget https://dist.ipfs.tech/kubo/v0.24.0/kubo_v0.24.0_linux-amd64.tar.gz
tar -xvzf kubo_v0.24.0_linux-amd64.tar.gz
cd kubo
sudo bash install.sh

# Initialize IPFS
ipfs init

# Start IPFS daemon
ipfs daemon
```

#### 4.2 Configure IPFS for Development

```bash
# Enable CORS for local development
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'
```

---

### Step 5: PostgreSQL Setup

#### 5.1 Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 5.2 Create Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE neural_privacy;
CREATE USER neural_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE neural_privacy TO neural_user;
\q
```

#### 5.3 Configure Environment

Create `.env` file in `backend/`:

```bash
DATABASE_URL=postgresql://neural_user:your_secure_password@localhost:5432/neural_privacy
IPFS_URL=http://localhost:5001
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
SERVER_PORT=3000
RUST_LOG=info
```

#### 5.4 Run Migrations

```bash
cd backend

# Install sqlx-cli if not already installed
cargo install sqlx-cli --no-default-features --features postgres

# Run migrations
sqlx migrate run

# Build and run the backend
cargo build --release
cargo run --release
```

---

### Step 6: Frontend Setup

#### 6.1 Initialize React Application

```bash
cd ../../../frontend/data-owner
npm create vite@latest . -- --template react-ts
npm install

# Install dependencies
npm install wagmi viem @tanstack/react-query
npm install ethers
npm install zustand
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install tailwindcss postcss autoprefixer
npm install lucide-react
npm install recharts

# Initialize Tailwind
npx tailwindcss init -p
```

#### 6.2 Configure Tailwind CSS

**File: `tailwind.config.js`**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neural: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        }
      }
    },
  },
  plugins: [],
}
```

#### 6.3 Create Core Components

**File: `src/wagmi.config.ts`**

```typescript
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, polygon, arbitrum } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, sepolia, polygon, arbitrum],
  connectors: [
    injected(),
    walletConnect({ projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
});
```

**File: `src/main.tsx`**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './wagmi.config';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
```

**File: `src/stores/authStore.ts`**

```typescript
import { create } from 'zustand';

interface AuthState {
  isConnected: boolean;
  address: string | null;
  setConnected: (connected: boolean, address: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isConnected: false,
  address: null,
  setConnected: (connected, address) => set({ isConnected: connected, address }),
}));
```

**File: `src/components/Dashboard.tsx`**

```typescript
import React from 'react';
import { useAccount } from 'wagmi';
import { Brain, Shield, Database, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neural-900 via-slate-900 to-neural-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <Brain className="w-10 h-10 text-neural-500" />
          Neural Privacy Dashboard
        </h1>

        <div className="mb-6 text-sm text-gray-400">
          Connected: {address}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Shield className="w-8 h-8" />}
            title="Active Consents"
            value="3"
            trend="+2 this week"
          />
          <StatCard
            icon={<Database className="w-8 h-8" />}
            title="Data Stored"
            value="2.4 GB"
            trend="Encrypted"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Earnings"
            value="0.125 ETH"
            trend="+15% this month"
          />
          <StatCard
            icon={<Brain className="w-8 h-8" />}
            title="Research Projects"
            value="5"
            trend="Contributing"
          />
        </div>

        {/* Add more dashboard components */}
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
}> = ({ icon, title, value, trend }) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-neural-500 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="text-neural-400">{icon}</div>
    </div>
    <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
    <p className="text-3xl font-bold mb-1">{value}</p>
    <p className="text-xs text-neural-400">{trend}</p>
  </div>
);
```

**File: `src/components/WalletConnect.tsx`**

```typescript
import React from 'react';
import { useConnect, useDisconnect, useAccount } from 'wagmi';
import { Wallet } from 'lucide-react';

export const WalletConnect: React.FC = () => {
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          className="px-6 py-3 bg-neural-600 hover:bg-neural-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <Wallet className="w-5 h-5" />
          Connect {connector.name}
        </button>
      ))}
    </div>
  );
}
```

---

### Step 7: Testing & Deployment

#### 7.1 Smart Contract Testing

```bash
cd contracts/solidity

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Run tests with coverage
npx hardhat coverage

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test
```

**File: `test/IdentityRegistry.test.ts`**

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { IdentityRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("IdentityRegistry", function () {
  let identityRegistry: IdentityRegistry;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let researcher1: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, researcher1] = await ethers.getSigners();
    
    const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
    identityRegistry = await IdentityRegistry.deploy();
    await identityRegistry.waitForDeployment();
  });

  describe("User Registration", function () {
    it("Should register a new user", async function () {
      const publicKey = ethers.randomBytes(33);
      const vaultCID = "QmTest123";
      const keyCID = "QmKey456";

      await expect(
        identityRegistry.connect(user1).registerUser(publicKey, vaultCID, keyCID)
      )
        .to.emit(identityRegistry, "UserRegistered")
        .withArgs(user1.address, vaultCID, await ethers.provider.getBlock('latest').then(b => b!.timestamp + 1));

      const profile = await identityRegistry.getUserProfile(user1.address);
      expect(profile.active).to.be.true;
      expect(profile.dataVaultCID).to.equal(vaultCID);
    });

    it("Should not allow duplicate registration", async function () {
      const publicKey = ethers.randomBytes(33);
      const vaultCID = "QmTest123";
      const keyCID = "QmKey456";

      await identityRegistry.connect(user1).registerUser(publicKey, vaultCID, keyCID);

      await expect(
        identityRegistry.connect(user1).registerUser(publicKey, vaultCID, keyCID)
      ).to.be.revertedWith("User already registered");
    });
  });

  describe("Access Grants", function () {
    beforeEach(async function () {
      const publicKey = ethers.randomBytes(33);
      await identityRegistry.connect(user1).registerUser(publicKey, "QmVault1", "QmKey1");
      await identityRegistry.connect(researcher1).registerUser(publicKey, "QmVault2", "QmKey2");
    });

    it("Should grant access to researcher", async function () {
      const dataCategory = "EEG";
      const duration = 86400; // 1 day
      const compensation = ethers.parseEther("0.1");
      const purpose = "Research study on neural patterns";

      await expect(
        identityRegistry.connect(user1).grantAccess(
          researcher1.address,
          dataCategory,
          duration,
          compensation,
          purpose
        )
      ).to.emit(identityRegistry, "AccessGranted");

      const isValid = await identityRegistry.isAccessValid(
        user1.address,
        researcher1.address,
        dataCategory
      );
      expect(isValid).to.be.true;
    });

    it("Should revoke access", async function () {
      const dataCategory = "EEG";
      await identityRegistry.connect(user1).grantAccess(
        researcher1.address,
        dataCategory,
        86400,
        ethers.parseEther("0.1"),
        "Research"
      );

      await expect(
        identityRegistry.connect(user1).revokeAccess(researcher1.address, dataCategory)
      ).to.emit(identityRegistry, "AccessRevoked");

      const isValid = await identityRegistry.isAccessValid(
        user1.address,
        researcher1.address,
        dataCategory
      );
      expect(isValid).to.be.false;
    });
  });
});
```

**File: `test/PaymentDistributor.test.ts`**

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { PaymentDistributor } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("PaymentDistributor", function () {
  let paymentDistributor: PaymentDistributor;
  let dataOwner: SignerWithAddress;
  let researcher: SignerWithAddress;

  beforeEach(async function () {
    [dataOwner, researcher] = await ethers.getSigners();
    
    const PaymentDistributor = await ethers.getContractFactory("PaymentDistributor");
    paymentDistributor = await PaymentDistributor.deploy();
    await paymentDistributor.waitForDeployment();
  });

  it("Should create payment agreement", async function () {
    const amount = ethers.parseEther("0.1");

    await expect(
      paymentDistributor.connect(researcher).createPaymentAgreement(dataOwner.address, amount)
    )
      .to.emit(paymentDistributor, "AgreementCreated")
      .withArgs(dataOwner.address, researcher.address, 1, amount);
  });

  it("Should escrow payment", async function () {
    const amount = ethers.parseEther("0.1");
    
    await paymentDistributor.connect(researcher).createPaymentAgreement(dataOwner.address, amount);

    await expect(
      paymentDistributor.connect(researcher).escrowPayment(dataOwner.address, 1, { value: amount })
    )
      .to.emit(paymentDistributor, "PaymentEscrowed")
      .withArgs(dataOwner.address, researcher.address, 1, amount);
  });

  it("Should release payment to data owner", async function () {
    const amount = ethers.parseEther("0.1");
    
    await paymentDistributor.connect(researcher).createPaymentAgreement(dataOwner.address, amount);
    await paymentDistributor.connect(researcher).escrowPayment(dataOwner.address, 1, { value: amount });

    const balanceBefore = await ethers.provider.getBalance(dataOwner.address);

    await expect(
      paymentDistributor.connect(dataOwner).releasePayment(researcher.address, 1)
    )
      .to.emit(paymentDistributor, "PaymentReleased")
      .withArgs(dataOwner.address, researcher.address, 1, amount);

    const balanceAfter = await ethers.provider.getBalance(dataOwner.address);
    expect(balanceAfter).to.be.gt(balanceBefore);
  });
});
```

#### 7.2 Integration Testing

Create `tests/integration.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { ethers } from 'ethers';

describe('Neural Privacy Protocol Integration', () => {
  it('should register a new user and grant access', async () => {
    // Integration test implementation
    // This would test the full flow from frontend to smart contracts
  });

  it('should handle payment flow correctly', async () => {
    // Test payment creation, escrow, and release
  });

  it('should manage consent preferences', async () => {
    // Test consent management flow
  });
});
```

#### 7.3 Docker Deployment

**File: `docker-compose.yml`**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: neural_privacy
      POSTGRES_USER: neural_user
      POSTGRES_PASSWORD: secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U neural_user -d neural_privacy"]
      interval: 10s
      timeout: 5s
      retries: 5

  ipfs:
    image: ipfs/kubo:latest
    ports:
      - "4001:4001"
      - "5001:5001"
      - "8080:8080"
    volumes:
      - ipfs-data:/data/ipfs

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://neural_user:secure_password@postgres:5432/neural_privacy
      - IPFS_URL=http://ipfs:5001
      - ETHEREUM_RPC_URL=${ETHEREUM_RPC_URL}
      - CONTRACT_ADDRESS=${CONTRACT_ADDRESS}
      - SERVER_PORT=3000
      - RUST_LOG=info
    depends_on:
      postgres:
        condition: service_healthy
      ipfs:
        condition: service_started
    volumes:
      - ./backend:/app
    command: cargo run --release

  frontend:
    build: ./frontend/data-owner
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:3000
      - VITE_NETWORK=sepolia
      - VITE_WALLETCONNECT_PROJECT_ID=${WALLETCONNECT_PROJECT_ID}
    depends_on:
      - backend

volumes:
  postgres-data:
  ipfs-data:
```

**File: `backend/Dockerfile`**

```dockerfile
FROM rust:1.75 as builder

WORKDIR /app

# Copy manifests
COPY Cargo.toml Cargo.lock ./

# Copy source code
COPY src ./src
COPY migrations ./migrations

# Build for release
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/target/release/neural-backend /app/neural-backend
COPY --from=builder /app/migrations /app/migrations

EXPOSE 3000

CMD ["/app/neural-backend"]
```

---

## Security Considerations

### 1. Cryptographic Security
- **Key Management**: Use Hardware Security Modules (HSM) for production
- **Key Rotation**: Implement automated key rotation policies
- **Secure Enclaves**: Consider Intel SGX or ARM TrustZone for sensitive operations

### 2. Smart Contract Security
- **Audits**: Conduct third-party security audits before mainnet
- **Formal Verification**: Use tools like Certora or K Framework
- **Bug Bounties**: Implement responsible disclosure programs

### 3. Privacy Guarantees
- **Differential Privacy**: Calibrate ε and δ parameters carefully
- **ZKP Soundness**: Ensure circuit correctness and trusted setup
- **Metadata Leakage**: Minimize timing and size-based attacks

### 4. Access Control
- **Multi-Signature**: Require multi-sig for critical operations
- **Time Locks**: Implement time-delayed revocations
- **Rate Limiting**: Prevent abuse and DoS attacks

### 5. Compliance
- **GDPR**: Implement right to erasure (cryptographic deletion)
- **HIPAA**: Ensure BAA compliance for health data
- **FDA**: Consider regulatory requirements for medical devices

---

## Future Enhancements

### Short-term (3-6 months)
- [ ] Mobile applications (iOS/Android)
- [ ] Advanced federated learning algorithms
- [ ] Multi-chain support (Ethereum, Polygon, Solana)
- [ ] Enhanced analytics dashboard
- [ ] Automated compliance reporting

### Medium-term (6-12 months)
- [ ] Decentralized identity integration (DID)
- [ ] Homomorphic encryption for computation on encrypted data
- [ ] DAO governance for protocol upgrades
- [ ] Marketplace for AI models trained on BCI data
- [ ] Integration with existing BCI devices (Neuralink API when available)

### Long-term (12+ months)
- [ ] Cross-chain interoperability protocols
- [ ] Quantum-resistant cryptography
- [ ] Real-time federated learning
- [ ] Decentralized compute network for privacy-preserving analytics
- [ ] Global neural data standards consortium

---

## Resources & References

### Documentation
- [Stacks Documentation](https://docs.stacks.co/)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [Circom Documentation](https://docs.circom.io/)
- [PySyft Documentation](https://github.com/OpenMined/PySyft)

### Research Papers
- "Differential Privacy" by Dwork & Roth
- "Federated Learning" by McMahan et al.
- "Zero-Knowledge Proofs" by Goldwasser, Micali, Rackoff
- "Neural Data Privacy" - Various neuroscience journals

### Standards
- SIP-009: NFT Standard (Stacks)
- SIP-010: Fungible Token Standard (Stacks)
- W3C Decentralized Identifiers (DIDs)
- IEEE 2410: Biometric Privacy Standard

---

## Support & Community

- **GitHub**: [Repository Link]
- **Discord**: [Community Server]
- **Documentation**: [Docs Site]
- **Email**: privacy@neural-layer.io

---

## License

MIT License - See LICENSE file for details

---

**Built for PL_Genesis Hackathon**
*Empowering individuals with neural data sovereignty*
