import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { db } from '../../database/client';
import { pinata } from '../../storage/pinata.service';
import { EncryptionService } from '../../encryption/encryption.service';
import { config } from '../../config';

const encryptionService = new EncryptionService(config.ENCRYPTION_KEY);

/**
 * Get user's data records
 * GET /api/data/:userId
 */
export async function getUserDataRecords(req: Request, res: Response) {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'Missing user_id parameter',
            });
        }

        const records = await db.getUserDataRecords(userId);

        res.json({
            success: true,
            data: records,
        });
    } catch (error: any) {
        logger.error('Failed to get user data records:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

/**
 * Download data from IPFS
 * GET /api/data/download/:cid
 */
export async function downloadData(req: Request, res: Response) {
    try {
        const { cid } = req.params;
        const { decrypt = 'false', iv, authTag } = req.query;

        if (!cid) {
            return res.status(400).json({
                success: false,
                error: 'Missing CID parameter',
            });
        }

        // Get data record from database
        const record = await db.getDataRecordsByCID(cid);

        if (!record) {
            return res.status(404).json({
                success: false,
                error: 'Data record not found',
            });
        }

        // Download from IPFS
        const encryptedData = await pinata.download(cid);

        // If data is encrypted and decryption is requested
        if (decrypt === 'true' && record.encrypted) {
            if (!iv || !authTag) {
                // Try to get from metadata
                const metadata = record.metadata as any;
                if (metadata?.iv && metadata?.authTag) {
                    const ivBuffer = Buffer.from(metadata.iv, 'base64');
                    const authTagBuffer = Buffer.from(metadata.authTag, 'base64');
                    
                    try {
                        const decrypted = encryptionService.decrypt(encryptedData, ivBuffer, authTagBuffer);
                        return res.json({
                            success: true,
                            data: {
                                cid,
                                decrypted: decrypted.toString('base64'),
                                encrypted: false,
                            },
                        });
                    } catch (error: any) {
                        logger.error('Decryption failed:', error);
                        return res.status(500).json({
                            success: false,
                            error: 'Failed to decrypt data',
                        });
                    }
                } else {
                    return res.status(400).json({
                        success: false,
                        error: 'Missing IV and authTag for decryption',
                    });
                }
            } else {
                const ivBuffer = Buffer.from(iv as string, 'base64');
                const authTagBuffer = Buffer.from(authTag as string, 'base64');
                
                try {
                    const decrypted = encryptionService.decrypt(encryptedData, ivBuffer, authTagBuffer);
                    return res.json({
                        success: true,
                        data: {
                            cid,
                            decrypted: decrypted.toString('base64'),
                            encrypted: false,
                        },
                    });
                } catch (error: any) {
                    logger.error('Decryption failed:', error);
                    return res.status(500).json({
                        success: false,
                        error: 'Failed to decrypt data',
                    });
                }
            }
        }

        // Return encrypted data
        res.json({
            success: true,
            data: {
                cid,
                encrypted: encryptedData.toString('base64'),
                encrypted_flag: record.encrypted,
                metadata: record.metadata,
            },
        });
    } catch (error: any) {
        logger.error('Failed to download data:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

/**
 * Delete a data record
 * DELETE /api/data/:id
 */
export async function deleteDataRecord(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Missing id parameter',
            });
        }

        // Get record first to get CID (for optional IPFS unpinning)
        const { data: record, error: fetchError } = await db.getClient()
            .from('data_records')
            .select('*')
            .eq('id', id)
            .single();
        
        if (fetchError || !record) {
            return res.status(404).json({
                success: false,
                error: 'Data record not found',
            });
        }

        // Optionally unpin from IPFS (if you want to remove from Pinata)
        // await pinata.unpin(record.ipfs_cid);

        // Delete from database
        const { error } = await db.getClient()
            .from('data_records')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Failed to delete data record: ${error.message}`);
        }

        logger.info(`Data record deleted: ${id}`);

        res.json({
            success: true,
            message: 'Data record deleted successfully',
        });
    } catch (error: any) {
        logger.error('Failed to delete data record:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

/**
 * Get data record by ID
 * GET /api/data/record/:id
 */
export async function getDataRecord(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Missing id parameter',
            });
        }

        // Get record from database
        const { data, error } = await db.getClient()
            .from('data_records')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({
                success: false,
                error: 'Data record not found',
            });
        }

        res.json({
            success: true,
            data,
        });
    } catch (error: any) {
        logger.error('Failed to get data record:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}
