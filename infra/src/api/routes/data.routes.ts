import { Router } from 'express';
import * as dataController from '../controllers/data.controller';

const router = Router();

// Data record routes
router.get('/:userId', dataController.getUserDataRecords);
router.get('/record/:id', dataController.getDataRecord);
router.get('/download/:cid', dataController.downloadData);
router.delete('/:id', dataController.deleteDataRecord);

export default router;
