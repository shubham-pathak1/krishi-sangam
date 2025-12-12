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
router.use(verifyJWT)
router.route("/").post(createContract);
router.route("/").get(getAllContracts);
router.route("/:id").get(getContractById);
router.route("/:id").put(updateContract);
router.route("/:id").delete(deleteContract);

export default router;
