import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';

// Database types
export interface User {
    id: string;
    wallet_address: string;
    public_key: string;
    data_vault_cid?: string;
    encryption_key_cid?: string;
    created_at: string;
    updated_at: string;
}

export interface DataRecord {
    id: string;
    user_id: string;
    data_type: string;
    ipfs_cid: string;
    encrypted: boolean;
    size_bytes: number;
    metadata?: Record<string, any>;
    created_at: string;
}

export interface ConsentLog {
    id: string;
    data_owner_address: string;
    researcher_address: string;
    request_id: number;
    data_type: string;
    consent_level: number;
    purpose: string;
    approved: boolean;
    created_at: string;
}

export interface PaymentAgreement {
    id: string;
    agreement_id: number;
    data_owner_address: string;
    researcher_address: string;
    amount: string;
    escrowed: boolean;
    released: boolean;
    paid: boolean;
    created_at: string;
    updated_at: string;
}

class DatabaseClient {
    private client: SupabaseClient;

    constructor() {
        this.client = createClient(
            config.SUPABASE_URL,
            config.SUPABASE_SERVICE_KEY
        );
    }

    // User operations
    async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await this.client
            .from('users')
            .insert(user)
            .select()
            .single();

        if (error) throw new Error(`Failed to create user: ${error.message}`);
        return data as User;
    }

    async getUserByWallet(walletAddress: string) {
        const { data, error } = await this.client
            .from('users')
            .select('*')
            .eq('wallet_address', walletAddress)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Failed to get user: ${error.message}`);
        }
        return data as User | null;
    }

    async updateUserVault(walletAddress: string, vaultCid: string, keyCid: string) {
        const { data, error } = await this.client
            .from('users')
            .update({
                data_vault_cid: vaultCid,
                encryption_key_cid: keyCid,
                updated_at: new Date().toISOString()
            })
            .eq('wallet_address', walletAddress)
            .select()
            .single();

        if (error) throw new Error(`Failed to update vault: ${error.message}`);
        return data as User;
    }

    // Data record operations
    async createDataRecord(record: Omit<DataRecord, 'id' | 'created_at'>) {
        const { data, error } = await this.client
            .from('data_records')
            .insert(record)
            .select()
            .single();

        if (error) throw new Error(`Failed to create data record: ${error.message}`);
        return data as DataRecord;
    }

    async getDataRecordsByCID(cid: string) {
        const { data, error } = await this.client
            .from('data_records')
            .select('*')
            .eq('ipfs_cid', cid)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Failed to get data record: ${error.message}`);
        }
        return data as DataRecord | null;
    }

    async getUserDataRecords(userId: string) {
        const { data, error } = await this.client
            .from('data_records')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(`Failed to get user data: ${error.message}`);
        return data as DataRecord[];
    }

    // Consent log operations
    async createConsentLog(log: Omit<ConsentLog, 'id' | 'created_at'>) {
        const { data, error } = await this.client
            .from('consent_logs')
            .insert(log)
            .select()
            .single();

        if (error) throw new Error(`Failed to create consent log: ${error.message}`);
        return data as ConsentLog;
    }

    async getConsentLogs(walletAddress: string) {
        const { data, error } = await this.client
            .from('consent_logs')
            .select('*')
            .or(`data_owner_address.eq.${walletAddress},researcher_address.eq.${walletAddress}`)
            .order('created_at', { ascending: false });

        if (error) throw new Error(`Failed to get consent logs: ${error.message}`);
        return data as ConsentLog[];
    }

    // Payment agreement operations
    async createPaymentAgreement(agreement: Omit<PaymentAgreement, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await this.client
            .from('payment_agreements')
            .insert(agreement)
            .select()
            .single();

        if (error) throw new Error(`Failed to create payment agreement: ${error.message}`);
        return data as PaymentAgreement;
    }

    async updatePaymentStatus(agreementId: number, updates: Partial<PaymentAgreement>) {
        const { data, error } = await this.client
            .from('payment_agreements')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('agreement_id', agreementId)
            .select()
            .single();

        if (error) throw new Error(`Failed to update payment: ${error.message}`);
        return data as PaymentAgreement;
    }

    async getPaymentAgreements(walletAddress: string) {
        const { data, error } = await this.client
            .from('payment_agreements')
            .select('*')
            .or(`data_owner_address.eq.${walletAddress},researcher_address.eq.${walletAddress}`)
            .order('created_at', { ascending: false });

        if (error) throw new Error(`Failed to get payments: ${error.message}`);
        return data as PaymentAgreement[];
    }

    getClient() {
        return this.client;
    }
}

export const db = new DatabaseClient();
