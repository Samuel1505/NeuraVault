import { Contract } from 'ethers';
import { blockchain } from '../client';

export const IDENTITY_REGISTRY_ADDRESS = '0xaACa195a145896455e70F779f06f8Ac2f8e4Ca76';

export const IDENTITY_REGISTRY_ABI = [
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
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
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
        "indexed": false,
        "internalType": "string",
        "name": "dataCategory",
        "type": "string"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "expiresAt",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "compensation",
        "type": "uint256"
    }
    ],
    "name": "AccessGranted",
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
        "indexed": false,
        "internalType": "string",
        "name": "dataCategory",
        "type": "string"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
    }
    ],
    "name": "AccessRevoked",
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
        "name": "dataVaultCID",
        "type": "string"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
    }
    ],
    "name": "UserRegistered",
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
        "name": "newCID",
        "type": "string"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
    }
    ],
    "name": "VaultUpdated",
    "type": "event"
},
{
    "inputs": [
    {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
    }
    ],
    "name": "accessGrants",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "grantedAt",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "expiresAt",
        "type": "uint256"
    },
    {
        "internalType": "bool",
        "name": "revoked",
        "type": "bool"
    },
    {
        "internalType": "uint256",
        "name": "compensationAmount",
        "type": "uint256"
    },
    {
        "internalType": "string",
        "name": "purpose",
        "type": "string"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "deactivateAccount",
    "outputs": [],
    "stateMutability": "nonpayable",
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
        "internalType": "string",
        "name": "_dataCategory",
        "type": "string"
    }
    ],
    "name": "getAccessGrant",
    "outputs": [
    {
        "components": [
        {
            "internalType": "uint256",
            "name": "grantedAt",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "expiresAt",
            "type": "uint256"
        },
        {
            "internalType": "bool",
            "name": "revoked",
            "type": "bool"
        },
        {
            "internalType": "uint256",
            "name": "compensationAmount",
            "type": "uint256"
        },
        {
            "internalType": "string",
            "name": "purpose",
            "type": "string"
        }
        ],
        "internalType": "struct IdentityRegistry.AccessGrant",
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
    }
    ],
    "name": "getUserProfile",
    "outputs": [
    {
        "components": [
        {
            "internalType": "bytes32",
            "name": "publicKeyHash",
            "type": "bytes32"
        },
        {
            "internalType": "string",
            "name": "dataVaultCID",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "encryptionKeyCID",
            "type": "string"
        },
        {
            "internalType": "uint256",
            "name": "registeredAt",
            "type": "uint256"
        },
        {
            "internalType": "bool",
            "name": "active",
            "type": "bool"
        }
        ],
        "internalType": "struct IdentityRegistry.UserProfile",
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
        "name": "_researcher",
        "type": "address"
    },
    {
        "internalType": "string",
        "name": "_dataCategory",
        "type": "string"
    },
    {
        "internalType": "uint256",
        "name": "_duration",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "_compensation",
        "type": "uint256"
    },
    {
        "internalType": "string",
        "name": "_purpose",
        "type": "string"
    }
    ],
    "name": "grantAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
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
        "internalType": "string",
        "name": "_dataCategory",
        "type": "string"
    }
    ],
    "name": "isAccessValid",
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
    "name": "reactivateAccount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes32",
        "name": "_publicKeyHash",
        "type": "bytes32"
    },
    {
        "internalType": "string",
        "name": "_vaultCID",
        "type": "string"
    },
    {
        "internalType": "string",
        "name": "_keyCID",
        "type": "string"
    }
    ],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
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
        "name": "_researcher",
        "type": "address"
    },
    {
        "internalType": "string",
        "name": "_dataCategory",
        "type": "string"
    }
    ],
    "name": "revokeAccess",
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
},
{
    "inputs": [
    {
        "internalType": "string",
        "name": "_newKeyCID",
        "type": "string"
    }
    ],
    "name": "updateEncryptionKeyCID",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "string",
        "name": "_newCID",
        "type": "string"
    }
    ],
    "name": "updateVaultCID",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "name": "userProfiles",
    "outputs": [
    {
        "internalType": "bytes32",
        "name": "publicKeyHash",
        "type": "bytes32"
    },
    {
        "internalType": "string",
        "name": "dataVaultCID",
        "type": "string"
    },
    {
        "internalType": "string",
        "name": "encryptionKeyCID",
        "type": "string"
    },
    {
        "internalType": "uint256",
        "name": "registeredAt",
        "type": "uint256"
    },
    {
        "internalType": "bool",
        "name": "active",
        "type": "bool"
    }
    ],
    "stateMutability": "view",
    "type": "function"
}
] as const;

/**
 * Get IdentityRegistry contract instance
 * @param signer Optional signer for write operations
 * @returns Contract instance
 */
export function getIdentityRegistryContract(signer?: any): Contract {
    const provider = blockchain.getProvider();
    return new Contract(IDENTITY_REGISTRY_ADDRESS, IDENTITY_REGISTRY_ABI, signer || provider);
}