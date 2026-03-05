import { Contract } from 'ethers';
import { blockchain } from '../client';

export const CONSENT_MANAGER_ADDRESS = '0xa723eE729F31831DF32f59a107790A6E5c76175A';

export const CONSENT_MANAGER_ABI = [
{
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "owner",
        "type": "address"
    }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "address",
        "name": "dataOwner",
        "type": "address"
    },
    {
        "indexed": true,
        "internalType": "address",
        "name": "researcher",
        "type": "address"
    },
    {
        "indexed": true,
        "internalType": "uint256",
        "name": "requestId",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
    }
    ],
    "name": "ConsentApproved",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "address",
        "name": "dataOwner",
        "type": "address"
    },
    {
        "indexed": true,
        "internalType": "address",
        "name": "researcher",
        "type": "address"
    },
    {
        "indexed": true,
        "internalType": "uint256",
        "name": "requestId",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
    }
    ],
    "name": "ConsentDenied",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
    },
    {
        "indexed": false,
        "internalType": "string",
        "name": "dataType",
        "type": "string"
    },
    {
        "indexed": false,
        "internalType": "enum ConsentManager.ConsentLevel",
        "name": "level",
        "type": "uint8"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
    }
    ],
    "name": "ConsentPreferenceSet",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "address",
        "name": "dataOwner",
        "type": "address"
    },
    {
        "indexed": true,
        "internalType": "address",
        "name": "researcher",
        "type": "address"
    },
    {
        "indexed": true,
        "internalType": "uint256",
        "name": "requestId",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "string",
        "name": "dataType",
        "type": "string"
    },
    {
        "indexed": false,
        "internalType": "enum ConsentManager.ConsentLevel",
        "name": "level",
        "type": "uint8"
    }
    ],
    "name": "ConsentRequested",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
    },
    {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_researcher",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "_requestId",
        "type": "uint256"
    }
    ],
    "name": "approveConsentRequest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
    }
    ],
    "name": "consentLogs",
    "outputs": [
    {
        "internalType": "string",
        "name": "dataType",
        "type": "string"
    },
    {
        "internalType": "enum ConsentManager.ConsentLevel",
        "name": "consentLevel",
        "type": "uint8"
    },
    {
        "internalType": "string",
        "name": "purpose",
        "type": "string"
    },
    {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
    },
    {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
    }
    ],
    "name": "consentPreferences",
    "outputs": [
    {
        "internalType": "enum ConsentManager.ConsentLevel",
        "name": "consentLevel",
        "type": "uint8"
    },
    {
        "internalType": "uint256",
        "name": "maxDurationBlocks",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "minCompensation",
        "type": "uint256"
    },
    {
        "internalType": "bool",
        "name": "autoApprove",
        "type": "bool"
    },
    {
        "internalType": "uint256",
        "name": "updatedAt",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "purposeCount",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_researcher",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "_requestId",
        "type": "uint256"
    }
    ],
    "name": "denyConsentRequest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_user",
        "type": "address"
    },
    {
        "internalType": "string",
        "name": "_dataType",
        "type": "string"
    }
    ],
    "name": "getAllowedPurposes",
    "outputs": [
    {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
    },
    {
        "internalType": "address",
        "name": "_researcher",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "_requestId",
        "type": "uint256"
    }
    ],
    "name": "getConsentLog",
    "outputs": [
    {
        "components": [
        {
            "internalType": "string",
            "name": "dataType",
            "type": "string"
        },
        {
            "internalType": "enum ConsentManager.ConsentLevel",
            "name": "consentLevel",
            "type": "uint8"
        },
        {
            "internalType": "string",
            "name": "purpose",
            "type": "string"
        },
        {
            "internalType": "bool",
            "name": "approved",
            "type": "bool"
        },
        {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
        }
        ],
        "internalType": "struct ConsentManager.ConsentLog",
        "name": "",
        "type": "tuple"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_user",
        "type": "address"
    },
    {
        "internalType": "string",
        "name": "_dataType",
        "type": "string"
    }
    ],
    "name": "getConsentPreference",
    "outputs": [
    {
        "components": [
        {
            "internalType": "enum ConsentManager.ConsentLevel",
            "name": "consentLevel",
            "type": "uint8"
        },
        {
            "internalType": "uint256",
            "name": "maxDurationBlocks",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "minCompensation",
            "type": "uint256"
        },
        {
            "internalType": "bool",
            "name": "autoApprove",
            "type": "bool"
        },
        {
            "internalType": "uint256",
            "name": "updatedAt",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "purposeCount",
            "type": "uint256"
        }
        ],
        "internalType": "struct ConsentManager.ConsentPreference",
        "name": "",
        "type": "tuple"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "getNextRequestId",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
    },
    {
        "internalType": "address",
        "name": "_researcher",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "_requestId",
        "type": "uint256"
    }
    ],
    "name": "isConsentApproved",
    "outputs": [
    {
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "owner",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_dataOwner",
        "type": "address"
    },
    {
        "internalType": "string",
        "name": "_dataType",
        "type": "string"
    },
    {
        "internalType": "enum ConsentManager.ConsentLevel",
        "name": "_level",
        "type": "uint8"
    },
    {
        "internalType": "string",
        "name": "_purpose",
        "type": "string"
    }
    ],
    "name": "requestConsent",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "string",
        "name": "_dataType",
        "type": "string"
    }
    ],
    "name": "revokeConsentPreference",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "string",
        "name": "_dataType",
        "type": "string"
    },
    {
        "internalType": "enum ConsentManager.ConsentLevel",
        "name": "_level",
        "type": "uint8"
    },
    {
        "internalType": "string[]",
        "name": "_purposes",
        "type": "string[]"
    },
    {
        "internalType": "uint256",
        "name": "_maxDuration",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "_minComp",
        "type": "uint256"
    },
    {
        "internalType": "bool",
        "name": "_autoApprove",
        "type": "bool"
    }
    ],
    "name": "setConsentPreference",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}
] as const;

/**
 * Get ConsentManager contract instance
 * @param signer Optional signer for write operations
 * @returns Contract instance
 */
export function getConsentManagerContract(signer?: any): Contract {
    const provider = blockchain.getProvider();
    return new Contract(CONSENT_MANAGER_ADDRESS, CONSENT_MANAGER_ABI, signer || provider);
}