import {Router} from "express";
import {
    createContractTransaction, 
    getContractTransactions, 
    getContractTransactionById, 
    updateContractTransaction, 
    deleteContractTransaction
} from "../controllers/contractTransaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

// FIX: Use the correct function names
router.route("/").post(createContractTransaction);
router.route("/").get(getContractTransactions);
router.route("/:id").get(getContractTransactionById);
router.route("/:id").put(updateContractTransaction);
router.route("/:id").delete(deleteContractTransaction);

export default router;