import express from 'express';
import { createOrUpdateShiftRecord, getShiftRecords,deleteShiftRecord } from '../controllers/shiftController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { getShiftTypes } from '../controllers/adminController.js';

const router = express.Router();

router.post('/create-or-update-shift-record', authenticate,createOrUpdateShiftRecord);
router.get('/get-shift-records', authenticate,getShiftRecords);
router.get('/get-shift-types',authenticate,getShiftTypes);
router.delete('/delete-shift-record',authenticate,deleteShiftRecord);

export default router;
