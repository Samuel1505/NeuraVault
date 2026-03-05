import { Router } from 'express';
import * as consentController from '../controllers/consent.controller';

const router = Router();

// Consent preference routes
router.post('/preferences', consentController.setConsentPreference);
router.get('/preferences/:walletAddress/:dataType?', consentController.getConsentPreference);

// Consent request routes
router.post('/request', consentController.requestConsent);
router.post('/approve', consentController.approveConsentRequest);
router.post('/deny', consentController.denyConsentRequest);

// Consent log routes
router.get('/logs/:walletAddress', consentController.getConsentLogs);

export default router;
