import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    // Supabase
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string(),
    SUPABASE_SERVICE_KEY: z.string(),

    // Pinata
    PINATA_API_KEY: z.string(),
    PINATA_SECRET_KEY: z.string(),
    PINATA_JWT: z.string(),

    // Blockchain
    ETHEREUM_RPC_URL: z.string().url(),
    IDENTITY_REGISTRY_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    CONSENT_MANAGER_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    PAYMENT_DISTRIBUTOR_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/),

    // Server
    PORT: z.string().default('3000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Security
    ENCRYPTION_KEY: z.string().length(64), // 32 bytes in hex
    JWT_SECRET: z.string().min(32),
});

export const config = envSchema.parse(process.env);

export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
export const isTest = config.NODE_ENV === 'test';
