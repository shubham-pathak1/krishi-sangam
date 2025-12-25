import {Router} from "express";
import {
    createContract,
    getAllContracts,
    getContractById,
    updateContract,
    deleteContract
} from "../controllers/contract.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { AdminVerify, CompanyVerify } from "../middlewares/categoryAuth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(CompanyVerify, createContract);
// FIX: Changed AdminVerify to verifyJWT so Farmers can see contracts
router.route("/").get(verifyJWT, getAllContracts);
router.route("/:id").get(getContractById);
router.route("/:id").put(CompanyVerify, updateContract);
router.route("/:id").delete(CompanyVerify,deleteContract);

export default router;