import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';

const router = Router();

// Payment agreement routes
router.post('/agreement', paymentController.createPaymentAgreement);
router.get('/agreement/:dataOwner/:researcher/:agreementId', paymentController.getPaymentAgreement);
router.get('/agreements/:walletAddress', paymentController.getPaymentAgreements);

// Payment operation routes
router.post('/escrow', paymentController.escrowPayment);
router.post('/release', paymentController.releasePayment);
router.post('/refund', paymentController.refundPayment);

export default router;
