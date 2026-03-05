import { Contract } from 'ethers';
import { blockchain } from '../client';

export const PAYMENT_DISTRIBUTOR_ADDRESS = '0x47885948F659CcA0399E18bB64E84216f972Da03';

export const PAYMENT_DISTRIBUTOR_ABI = [
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
        "indexed": true,
        "internalType": "uint256",
        "name": "agreementId",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }
    ],
    "name": "AgreementCreated",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "internalType": "address",
        "name": "newCollector",
        "type": "address"
    }
    ],
    "name": "FeeCollectorUpdated",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "newFeePercent",
        "type": "uint256"
    }
    ],
    "name": "FeeUpdated",
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
        "name": "agreementId",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }
    ],
    "name": "PaymentEscrowed",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "address",
        "name": "researcher",
        "type": "address"
    },
    {
        "indexed": true,
        "internalType": "uint256",
        "name": "agreementId",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }
    ],
    "name": "PaymentRefunded",
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
        "name": "agreementId",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "fee",
        "type": "uint256"
    }
    ],
    "name": "PaymentReleased",
    "type": "event"
},
{
    "inputs": [],
    "name": "MAX_FEE_PERCENT",
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
        "internalType": "address[]",
        "name": "_researchers",
        "type": "address[]"
    },
    {
        "internalType": "uint256[]",
        "name": "_agreementIds",
        "type": "uint256[]"
    }
    ],
    "name": "batchReleasePayments",
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
        "internalType": "address",
        "name": "_researcher",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "_agreementId",
        "type": "uint256"
    }
    ],
    "name": "canReleasePayment",
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
    "inputs": [
    {
        "internalType": "address",
        "name": "_dataOwner",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "_releaseDelay",
        "type": "uint256"
    }
    ],
    "name": "createPaymentAgreement",
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
    "inputs": [],
    "name": "emergencyWithdraw",
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
        "internalType": "uint256",
        "name": "_agreementId",
        "type": "uint256"
    }
    ],
    "name": "escrowPayment",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
},
{
    "inputs": [],
    "name": "feeCollector",
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
    "name": "getNextAgreementId",
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
        "name": "_dataOwner",
        "type": "address"
    },
    {
        "internalType": "address",
        "name": "_researcher",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "_agreementId",
        "type": "uint256"
    }
    ],
    "name": "getPaymentAgreement",
    "outputs": [
    {
        "components": [
        {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
        },
        {
            "internalType": "bool",
            "name": "paid",
            "type": "bool"
        },
        {
            "internalType": "bool",
            "name": "escrowed",
            "type": "bool"
        },
        {
            "internalType": "bool",
            "name": "released",
            "type": "bool"
        },
        {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "releaseTime",
            "type": "uint256"
        }
        ],
        "internalType": "struct PaymentDistributor.PaymentAgreement",
        "name": "",
        "type": "tuple"
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
    "inputs": [
    {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
    }
    ],
    "name": "paymentAgreements",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    },
    {
        "internalType": "bool",
        "name": "paid",
        "type": "bool"
    },
    {
        "internalType": "bool",
        "name": "escrowed",
        "type": "bool"
    },
    {
        "internalType": "bool",
        "name": "released",
        "type": "bool"
    },
    {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "releaseTime",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "platformFeePercent",
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
        "name": "_dataOwner",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "_agreementId",
        "type": "uint256"
    }
    ],
    "name": "refundPayment",
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
        "internalType": "uint256",
        "name": "_agreementId",
        "type": "uint256"
    }
    ],
    "name": "releasePayment",
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
        "internalType": "address",
        "name": "_newCollector",
        "type": "address"
    }
    ],
    "name": "updateFeeCollector",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "_newFeePercent",
        "type": "uint256"
    }
    ],
    "name": "updatePlatformFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}
] as const;

/**
 * Get PaymentDistributor contract instance
 * @param signer Optional signer for write operations
 * @returns Contract instance
 */
export function getPaymentDistributorContract(signer?: any): Contract {
    const provider = blockchain.getProvider();
    return new Contract(PAYMENT_DISTRIBUTOR_ADDRESS, PAYMENT_DISTRIBUTOR_ABI, signer || provider);
}