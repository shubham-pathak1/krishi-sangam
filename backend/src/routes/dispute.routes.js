import { Router } from 'express';
import {
    createDispute,
    getAllDisputes,
    getDisputeById,
    updateDispute,
    deleteDispute
} from '../controllers/dispute.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { AdminVerify} from '../middlewares/categoryAuth.middleware.js';

const router = Router();
router.use(verifyJWT)
router.route('/').post(createDispute);
router.route('/').get(AdminVerify, getAllDisputes);
router.route('/:id').get(getDisputeById);
router.route('/:id').put(updateDispute);
router.route('/:id').delete(deleteDispute);

export default router;