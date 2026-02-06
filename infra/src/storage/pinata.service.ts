import axios from 'axios';
import FormData from 'form-data';
import { config } from '../config';

export class PinataService {
    private apiKey: string;
    private secretKey: string;
    private jwt: string;
    private baseUrl = 'https://api.pinata.cloud';

    constructor() {
        this.apiKey = config.PINATA_API_KEY;
        this.secretKey = config.PINATA_SECRET_KEY;
        this.jwt = config.PINATA_JWT;
    }

    /**
     * Upload data to IPFS via Pinata
     * @param data Buffer of data to upload
     * @param name Optional name for the file
     * @returns IPFS CID
     */
    async upload(data: Buffer, name?: string): Promise<string> {
        try {
            const formData = new FormData();
            formData.append('file', data, name || 'data');

            const response = await axios.post(
                `${this.baseUrl}/pinning/pinFileToIPFS`,
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                        'Authorization': `Bearer ${this.jwt}`,
                    },
                }
            );

            return response.data.IpfsHash;
        } catch (error: any) {
            throw new Error(`Failed to upload to Pinata: ${error.message}`);
        }
    }

    /**
     * Upload JSON data to IPFS via Pinata
     * @param json JSON object to upload
     * @param name Optional name for the JSON
     * @returns IPFS CID
     */
    async uploadJSON(json: Record<string, any>, name?: string): Promise<string> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/pinning/pinJSONToIPFS`,
                {
                    pinataContent: json,
                    pinataMetadata: {
                        name: name || 'data.json',
                    },
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.jwt}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data.IpfsHash;
        } catch (error: any) {
            throw new Error(`Failed to upload JSON to Pinata: ${error.message}`);
        }
    }

    /**
     * Download data from IPFS via Pinata gateway
     * @param cid IPFS CID
     * @returns Buffer of data
     */
    async download(cid: string): Promise<Buffer> {
        try {
            const response = await axios.get(
                `https://gateway.pinata.cloud/ipfs/${cid}`,
                {
                    responseType: 'arraybuffer',
                }
            );

            return Buffer.from(response.data);
        } catch (error: any) {
            throw new Error(`Failed to download from IPFS: ${error.message}`);
        }
    }

    /**
     * Download JSON data from IPFS
     * @param cid IPFS CID
     * @returns Parsed JSON object
     */
    async downloadJSON(cid: string): Promise<any> {
        try {
            const response = await axios.get(
                `https://gateway.pinata.cloud/ipfs/${cid}`,
                {
                    headers: {
                        'Accept': 'application/json',
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to download JSON from IPFS: ${error.message}`);
        }
    }

    /**
     * Unpin content from Pinata
     * @param cid IPFS CID to unpin
     */
    async unpin(cid: string): Promise<void> {
        try {
            await axios.delete(
                `${this.baseUrl}/pinning/unpin/${cid}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.jwt}`,
                    },
                }
            );
        } catch (error: any) {
            throw new Error(`Failed to unpin from Pinata: ${error.message}`);
        }
    }

    /**
     * List all pinned files
     */
    async listPins(): Promise<any[]> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/data/pinList?status=pinned`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.jwt}`,
                    },
                }
            );

            return response.data.rows;
        } catch (error: any) {
            throw new Error(`Failed to list pins: ${error.message}`);
        }
    }

    /**
     * Test connection to Pinata
     */
    async testConnection(): Promise<boolean> {
        try {
            await axios.get(`${this.baseUrl}/data/testAuthentication`, {
                headers: {
                    'Authorization': `Bearer ${this.jwt}`,
                },
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}

export const pinata = new PinataService();
