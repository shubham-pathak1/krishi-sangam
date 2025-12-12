import { Router } from 'express';
import {
    initiatePayment,
    verifyPayment,
    getPaymentById,
    getAllPayments
} from '../controllers/payment.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();
router.use(verifyJWT)
router.post("/initiate", initiatePayment);
router.post("/verify", verifyPayment);
router.get("/:id", getPaymentById);
router.get("/", getAllPayments);

export default router;