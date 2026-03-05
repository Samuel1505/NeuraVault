import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { db } from '../../database/client';
import { getPaymentDistributorContract } from '../../blockchain/contracts';
import { ethers } from 'ethers';

/**
 * Create a payment agreement
 * POST /api/payments/agreement
 */
export async function createPaymentAgreement(req: Request, res: Response) {
    try {
        const { data_owner_address, researcher_address, amount, release_delay } = req.body;

        // Validation
        if (!data_owner_address || !researcher_address || !amount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: data_owner_address, researcher_address, amount',
            });
        }

        // Validate amount
        try {
            const amountWei = ethers.parseEther(amount.toString());
            if (amountWei <= 0n) {
                return res.status(400).json({
                    success: false,
                    error: 'Amount must be greater than 0',
                });
            }
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: 'Invalid amount format',
            });
        }

        const contract = getPaymentDistributorContract();
        const releaseDelay = release_delay || 0; // Default to 0 (no delay)

        // Note: This should be called from frontend with researcher's wallet signature
        logger.info(`Payment agreement created: ${researcher_address} -> ${data_owner_address} for ${amount} ETH`);

        res.json({
            success: true,
            message: 'Payment agreement created. Please sign the transaction in your wallet.',
            data: {
                data_owner_address,
                researcher_address,
                amount: amount.toString(),
                release_delay: releaseDelay,
            },
        });
    } catch (error: any) {
        logger.error('Failed to create payment agreement:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

/**
 * Escrow payment for an agreement
 * POST /api/payments/escrow
 */
export async function escrowPayment(req: Request, res: Response) {
    try {
        const { data_owner_address, agreement_id, researcher_address } = req.body;

        // Validation
        if (!data_owner_address || agreement_id === undefined || !researcher_address) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: data_owner_address, agreement_id, researcher_address',
            });
        }

        const contract = getPaymentDistributorContract();

        // Get payment agreement to verify it exists and get amount
        try {
            const agreement = await contract.getPaymentAgreement(data_owner_address, researcher_address, agreement_id);

            if (agreement.escrowed) {
                return res.status(400).json({
                    success: false,
                    error: 'Payment already escrowed',
                });
            }

            // Update database
            await db.updatePaymentStatus(agreement_id, {
                escrowed: true,
            });

            logger.info(`Payment escrowed: Agreement ${agreement_id} for ${data_owner_address}`);

            res.json({
                success: true,
                message: 'Payment escrowed. Please send the payment transaction from your wallet.',
                data: {
                    data_owner_address,
                    researcher_address,
                    agreement_id,
                    amount: agreement.amount.toString(),
                },
            });
        } catch (error: any) {
            if (error.message?.includes('not found') || error.reason?.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    error: 'Payment agreement not found',
                });
            }
            throw error;
        }
    } catch (error: any) {
        logger.error('Failed to escrow payment:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

/**
 * Release escrowed payment to data owner
 * POST /api/payments/release
 */
export async function releasePayment(req: Request, res: Response) {
    try {
        const { researcher_address, agreement_id, data_owner_address } = req.body;

        // Validation
        if (!researcher_address || agreement_id === undefined || !data_owner_address) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: researcher_address, agreement_id, data_owner_address',
            });
        }

        const contract = getPaymentDistributorContract();

        // Check if payment can be released
        try {
            const canRelease = await contract.canReleasePayment(data_owner_address, agreement_id);
            
            if (!canRelease) {
                return res.status(400).json({
                    success: false,
                    error: 'Payment cannot be released yet. Check release time or escrow status.',
                });
            }

            const agreement = await contract.getPaymentAgreement(data_owner_address, researcher_address, agreement_id);

            // Update database
            await db.updatePaymentStatus(agreement_id, {
                released: true,
                paid: true,
            });

            logger.info(`Payment released: Agreement ${agreement_id} for ${data_owner_address}`);

            res.json({
                success: true,
                message: 'Payment released. Please sign the transaction in your wallet.',
                data: {
                    data_owner_address,
                    researcher_address,
                    agreement_id,
                    amount: agreement.amount.toString(),
                },
            });
        } catch (error: any) {
            if (error.message?.includes('not found') || error.reason?.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    error: 'Payment agreement not found',
                });
            }
            throw error;
        }
    } catch (error: any) {
        logger.error('Failed to release payment:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

/**
 * Refund escrowed payment to researcher
 * POST /api/payments/refund
 */
export async function refundPayment(req: Request, res: Response) {
    try {
        const { data_owner_address, agreement_id, researcher_address } = req.body;

        // Validation
        if (!data_owner_address || agreement_id === undefined || !researcher_address) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: data_owner_address, agreement_id, researcher_address',
            });
        }

        const contract = getPaymentDistributorContract();

        try {
            const agreement = await contract.getPaymentAgreement(data_owner_address, researcher_address, agreement_id);

            if (!agreement.escrowed) {
                return res.status(400).json({
                    success: false,
                    error: 'Payment not escrowed',
                });
            }

            if (agreement.released) {
                return res.status(400).json({
                    success: false,
                    error: 'Payment already released',
                });
            }

            // Update database
            await db.updatePaymentStatus(agreement_id, {
                released: true,
            });

            logger.info(`Payment refunded: Agreement ${agreement_id} to ${researcher_address}`);

            res.json({
                success: true,
                message: 'Payment refunded. Please sign the transaction in your wallet.',
                data: {
                    data_owner_address,
                    researcher_address,
                    agreement_id,
                    amount: agreement.amount.toString(),
                },
            });
        } catch (error: any) {
            if (error.message?.includes('not found') || error.reason?.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    error: 'Payment agreement not found',
                });
            }
            throw error;
        }
    } catch (error: any) {
        logger.error('Failed to refund payment:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

/**
 * Get payment agreements for a wallet address
 * GET /api/payments/agreements/:walletAddress
 */
export async function getPaymentAgreements(req: Request, res: Response) {
    try {
        const { walletAddress } = req.params;

        if (!walletAddress) {
            return res.status(400).json({
                success: false,
                error: 'Missing wallet_address parameter',
            });
        }

        const agreements = await db.getPaymentAgreements(walletAddress);

        res.json({
            success: true,
            data: agreements,
        });
    } catch (error: any) {
        logger.error('Failed to get payment agreements:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

/**
 * Get payment agreement details
 * GET /api/payments/agreement/:dataOwner/:researcher/:agreementId
 */
export async function getPaymentAgreement(req: Request, res: Response) {
    try {
        const { dataOwner, researcher, agreementId } = req.params;

        if (!dataOwner || !researcher || !agreementId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters',
            });
        }

        const contract = getPaymentDistributorContract();
        const agreement = await contract.getPaymentAgreement(dataOwner, researcher, parseInt(agreementId));

        res.json({
            success: true,
            data: {
                data_owner_address: dataOwner,
                researcher_address: researcher,
                agreement_id: parseInt(agreementId),
                amount: agreement.amount.toString(),
                escrowed: agreement.escrowed,
                released: agreement.released,
                paid: agreement.paid,
                created_at: new Date(Number(agreement.createdAt) * 1000).toISOString(),
                release_time: new Date(Number(agreement.releaseTime) * 1000).toISOString(),
            },
        });
    } catch (error: any) {
        logger.error('Failed to get payment agreement:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}
