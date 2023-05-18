import express from 'express';
import * as SuperController from '../controllers/super.controller';

const router = express.Router();

router.get('/admins/approval', SuperController.getAdminsForApproval);

router.get('/admins/rejection', SuperController.getAdminsForRejection);

router.put('/admins/grant/:adminEmail', SuperController.grantAdminPrivilige);
router.put('/admins/remove/:adminEmail', SuperController.removeAdminPrivilige);





export default router;
