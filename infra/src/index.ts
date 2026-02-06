import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { logger } from './utils/logger';
import { db } from './database/client';
import { pinata } from './storage/pinata.service';
import { blockchain } from './blockchain/client';
import { EncryptionService } from './encryption/encryption.service';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });
    next();
});

// Initialize services
const encryptionService = new EncryptionService(config.ENCRYPTION_KEY);

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
    try {
        const [dbConnected, ipfsConnected, blockchainConnected] = await Promise.all([
            db.getClient().from('users').select('count').limit(1).then(() => true).catch(() => false),
            pinata.testConnection(),
            blockchain.testConnection(),
        ]);

        const status = {
            success: true,
            message: 'OK',
            services: {
                database: dbConnected ? 'connected' : 'disconnected',
                ipfs: ipfsConnected ? 'connected' : 'disconnected',
                blockchain: blockchainConnected ? 'connected' : 'disconnected',
            },
            timestamp: new Date().toISOString(),
        };

        res.json(status);
    } catch (error: any) {
        logger.error('Health check failed:', error);
        res.status(503).json({
            success: false,
            message: 'Service unavailable',
            error: error.message,
        });
    }
});

// API routes (to be implemented)
app.get('/api', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Neural Privacy Layer API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            users: '/api/users',
            data: '/api/data',
            consent: '/api/consent',
            payments: '/api/payments',
        },
    });
});

// User routes placeholder
app.get('/api/users/:walletAddress', async (req: Request, res: Response) => {
    try {
        const { walletAddress } = req.params;
        const user = await db.getUserByWallet(walletAddress);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }

        res.json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        logger.error('Failed to get user:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

app.post('/api/users/register', async (req: Request, res: Response) => {
    try {
        const { wallet_address, public_key, data_vault_cid, encryption_key_cid } = req.body;

        // Validation
        if (!wallet_address || !public_key) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: wallet_address, public_key',
            });
        }

        // Check if user already exists
        const existing = await db.getUserByWallet(wallet_address);
        if (existing) {
            return res.status(409).json({
                success: false,
                error: 'User already registered',
            });
        }

        // Create user
        const user = await db.createUser({
            wallet_address,
            public_key,
            data_vault_cid,
            encryption_key_cid,
        });

        logger.info(`User registered: ${wallet_address}`);

        res.status(201).json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        logger.error('Failed to register user:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// Data upload endpoint
app.post('/api/data/upload', async (req: Request, res: Response) => {
    try {
        const { user_id, data_type, data, encrypt = true } = req.body;

        if (!user_id || !data_type || !data) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: user_id, data_type, data',
            });
        }

        // Convert base64 to buffer
        const dataBuffer = Buffer.from(data, 'base64');

        // Encrypt if requested
        let uploadData = dataBuffer;
        let metadata: any = { encrypted: encrypt };

        if (encrypt) {
            const { encrypted, iv, authTag } = encryptionService.encrypt(dataBuffer);
            uploadData = encrypted;
            metadata.iv = iv.toString('base64');
            metadata.authTag = authTag.toString('base64');
        }

        // Upload to IPFS via Pinata
        const cid = await pinata.upload(uploadData, `${data_type}_${Date.now()}`);

        // Save to database
        const record = await db.createDataRecord({
            user_id,
            data_type,
            ipfs_cid: cid,
            encrypted: encrypt,
            size_bytes: dataBuffer.length,
            metadata,
        });

        logger.info(`Data uploaded: ${cid} for user ${user_id}`);

        res.status(201).json({
            success: true,
            data: {
                cid,
                record,
            },
        });
    } catch (error: any) {
        logger.error('Failed to upload data:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message,
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Not found',
        path: req.path,
    });
});

// Start server
const PORT = parseInt(config.PORT);

async function startServer() {
    try {
        // Test connections
        logger.info('Testing service connections...');

        const blockchainOk = await blockchain.testConnection();
        const ipfsOk = await pinata.testConnection();

        if (!blockchainOk) {
            logger.warn('⚠️  Blockchain connection failed - some features may not work');
        }

        if (!ipfsOk) {
            logger.warn('⚠️  IPFS connection failed - upload/download features unavailable');
        }

        app.listen(PORT, () => {
            logger.info(`🚀 Server running on http://localhost:${PORT}`);
            logger.info(`📝 Environment: ${config.NODE_ENV}`);
            logger.info(`✅ API ready at http://localhost:${PORT}/api`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully...');
    process.exit(0);
});

startServer();
