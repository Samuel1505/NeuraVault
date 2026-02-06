import { ethers } from 'ethers';
import { config } from '../config';

export class BlockchainClient {
    private provider: ethers.JsonRpcProvider;
    public identityRegistryAddress: string;
    public consentManagerAddress: string;
    public paymentDistributorAddress: string;

    constructor() {
        this.provider = new ethers.JsonRpcProvider(config.ETHEREUM_RPC_URL);
        this.identityRegistryAddress = config.IDENTITY_REGISTRY_ADDRESS;
        this.consentManagerAddress = config.CONSENT_MANAGER_ADDRESS;
        this.paymentDistributorAddress = config.PAYMENT_DISTRIBUTOR_ADDRESS;
    }

    getProvider(): ethers.JsonRpcProvider {
        return this.provider;
    }

    /**
     * Get contract instance
     * @param address Contract address
     * @param abi Contract ABI
     * @returns Contract instance
     */
    getContract(address: string, abi: any[]): ethers.Contract {
        return new ethers.Contract(address, abi, this.provider);
    }

    /**
     * Test blockchain connection
     */
    async testConnection(): Promise<boolean> {
        try {
            const blockNumber = await this.provider.getBlockNumber();
            console.log(`✅ Connected to blockchain at block ${blockNumber}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to connect to blockchain:', error);
            return false;
        }
    }

    /**
     * Get current block number
     */
    async getBlockNumber(): Promise<number> {
        return await this.provider.getBlockNumber();
    }

    /**
     * Get transaction receipt
     */
    async getTransactionReceipt(txHash: string) {
        return await this.provider.getTransactionReceipt(txHash);
    }
}

export const blockchain = new BlockchainClient();
