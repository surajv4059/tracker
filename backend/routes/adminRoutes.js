import express from 'express';
import { addShiftType, calculateAllowances, deleteShiftType, getAllUsers, modifyShiftRecord, removeUser, updateShiftType } from '../controllers/adminController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeAdmin } from '../middlewares/authorizationMiddleware.js'
import { getShiftRecordsForSpecificUser } from '../controllers/shiftController.js';

const router = express.Router();
 
router.post('/add-shift-type',authenticate, authorizeAdmin,addShiftType);
router.put('/update-shift-type',authenticate,authorizeAdmin,updateShiftType);
router.delete('/delete-shift-type/:shiftTypeId',authenticate,authorizeAdmin,deleteShiftType);
router.get('/get-all-users',authenticate,authorizeAdmin,getAllUsers);
router.delete('/remove-user/:userId',authenticate,authorizeAdmin,removeUser);

router.put('/modify-shift-record/:recordId',authenticate,authorizeAdmin,modifyShiftRecord);
router.get('/get-shift-records-for-user', authenticate,authorizeAdmin, getShiftRecordsForSpecificUser);

router.post('/calculate-allowances',authenticate,authorizeAdmin, calculateAllowances);

export default router;
 