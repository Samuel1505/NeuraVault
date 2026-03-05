import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { db } from '../../database/client';
import { getConsentManagerContract } from '../../blockchain/contracts';
import { ethers } from 'ethers';

/**
 * Set consent preferences for a data type
 * POST /api/consent/preferences
 */
export async function setConsentPreference(req: Request, res: Response) {
    try {
        const { wallet_address, data_type, consent_level, purposes, max_duration_blocks, min_compensation, auto_approve } = req.body;

        // Validation
        if (!wallet_address || !data_type || consent_level === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: wallet_address, data_type, consent_level',
            });
        }

        // Validate consent level (0 = NONE, 1 = ANONYMIZED, 2 = AGGREGATED, 3 = RAW)
        if (consent_level < 0 || consent_level > 3) {
            return res.status(400).json({
                success: false,
                error: 'Invalid consent_level. Must be 0-3 (NONE, ANONYMIZED, AGGREGATED, RAW)',
            });
        }

        // Get contract instance (read-only for now - frontend will handle signing)
        const contract = getConsentManagerContract();

        // Note: In production, this should be called from the frontend with user's wallet
        // For now, we'll just log the preference. The actual on-chain call should be made client-side.
        logger.info(`Consent preference set: ${wallet_address} for ${data_type} at level ${consent_level}`);

        res.json({
            success: true,
            message: 'Consent preference recorded. Please sign the transaction in your wallet.',
            data: {
                wallet_address,
                data_type,
                consent_level,
                purposes: purposes || [],
                max_duration_blocks: max_duration_blocks || 0,
                min_compensation: min_compensation || '0',
                auto_approve: auto_approve || false,
            },
        });
    } catch (error: any) {
        logger.error('Failed to set consent preference:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

/**
 * Get consent preferences for a user and data type
 * GET /api/consent/preferences/:walletAddress/:dataType?
 */
export async function getConsentPreference(req: Request, res: Response) {
    try {
        const { walletAddress, dataType } = req.params;

        if (!walletAddress) {
            return res.status(400).json({
                success: false,
                error: 'Missing wallet_address parameter',
            });
        }

        const contract = getConsentManagerContract();

        if (dataType) {
            // Get specific data type preference
            try {
                const preference = await contract.getConsentPreference(walletAddress, dataType);
                const purposes = await contract.getAllowedPurposes(walletAddress, dataType);

                res.json({
                    success: true,
                    data: {
                        wallet_address: walletAddress,
                        data_type: dataType,
                        consent_level: preference.consentLevel,
                        max_duration_blocks: preference.maxDurationBlocks.toString(),
                        min_compensation: preference.minCompensation.toString(),
                        auto_approve: preference.autoApprove,
                        updated_at: new Date(Number(preference.updatedAt) * 1000).toISOString(),
                        purposes: purposes || [],
                    },
                });
            } catch (error: any) {
                if (error.message?.includes('not found') || error.reason?.includes('not found')) {
                    return res.status(404).json({
                        success: false,
                        error: 'Consent preference not found',
                    });
                }
                throw error;
            }
        } else {
            // Return message that dataType is required
            return res.status(400).json({
                success: false,
                error: 'dataType parameter is required',
            });
        }
    } catch (error: any) {
        logger.error('Failed to get consent preference:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

/**
 * Request consent from a data owner
 * POST /api/consent/request
 */
export async function requestConsent(req: Request, res: Response) {
    try {
        const { data_owner_address, researcher_address, data_type, consent_level, purpose } = req.body;

        // Validation
        if (!data_owner_address || !researcher_address || !data_type || consent_level === undefined || !purpose) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: data_owner_address, researcher_address, data_type, consent_level, purpose',
            });
        }

        const contract = getConsentManagerContract();

        // Note: This should be called from frontend with researcher's wallet signature
        // For now, we'll return the request details
        logger.info(`Consent requested: ${researcher_address} -> ${data_owner_address} for ${data_type}`);

        res.json({
            success: true,
            message: 'Consent request created. Please sign the transaction in your wallet.',
            data: {
                data_owner_address,
                researcher_address,
                data_type,
                consent_level,
                purpose,
            },
        });
    } catch (error: any) {
        logger.error('Failed to request consent:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

/**
 * Approve a consent request
 * POST /api/consent/approve
 */
export async function approveConsentRequest(req: Request, res: Response) {
    try {
        const { researcher_address, request_id, wallet_address } = req.body;

        // Validation
        if (!researcher_address || request_id === undefined || !wallet_address) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: researcher_address, request_id, wallet_address',
            });
        }

        const contract = getConsentManagerContract();

        // Get consent log to verify it exists
        try {
            const consentLog = await contract.getConsentLog(wallet_address, researcher_address, request_id);
            
            // Save to database
            await db.createConsentLog({
                data_owner_address: wallet_address,
                researcher_address,
                request_id: Number(request_id),
                data_type: consentLog.dataType,
                consent_level: consentLog.consentLevel,
                purpose: consentLog.purpose,
                approved: true,
            });

            logger.info(`Consent approved: ${wallet_address} approved request ${request_id} from ${researcher_address}`);

            res.json({
                success: true,
                message: 'Consent request approved. Please sign the transaction in your wallet.',
                data: {
                    researcher_address,
                    request_id,
                    approved: true,
                },
            });
        } catch (error: any) {
            if (error.message?.includes('not found') || error.reason?.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    error: 'Consent request not found',
                });
            }
            throw error;
        }
    } catch (error: any) {
        logger.error('Failed to approve consent:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

/**
 * Deny a consent request
 * POST /api/consent/deny
 */
export async function denyConsentRequest(req: Request, res: Response) {
    try {
        const { researcher_address, request_id, wallet_address } = req.body;

        // Validation
        if (!researcher_address || request_id === undefined || !wallet_address) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: researcher_address, request_id, wallet_address',
            });
        }

        const contract = getConsentManagerContract();

        // Get consent log to verify it exists
        try {
            const consentLog = await contract.getConsentLog(wallet_address, researcher_address, request_id);
            
            // Save to database
            await db.createConsentLog({
                data_owner_address: wallet_address,
                researcher_address,
                request_id: Number(request_id),
                data_type: consentLog.dataType,
                consent_level: consentLog.consentLevel,
                purpose: consentLog.purpose,
                approved: false,
            });

            logger.info(`Consent denied: ${wallet_address} denied request ${request_id} from ${researcher_address}`);

            res.json({
                success: true,
                message: 'Consent request denied. Please sign the transaction in your wallet.',
                data: {
                    researcher_address,
                    request_id,
                    approved: false,
                },
            });
        } catch (error: any) {
            if (error.message?.includes('not found') || error.reason?.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    error: 'Consent request not found',
                });
            }
            throw error;
        }
    } catch (error: any) {
        logger.error('Failed to deny consent:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

/**
 * Get consent logs for a wallet address
 * GET /api/consent/logs/:walletAddress
 */
export async function getConsentLogs(req: Request, res: Response) {
    try {
        const { walletAddress } = req.params;

        if (!walletAddress) {
            return res.status(400).json({
                success: false,
                error: 'Missing wallet_address parameter',
            });
        }

        const logs = await db.getConsentLogs(walletAddress);

        res.json({
            success: true,
            data: logs,
        });
    } catch (error: any) {
        logger.error('Failed to get consent logs:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}
