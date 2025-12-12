import {Router} from "express";
import {
    createCompany, 
    getAllCompanies, 
    getCompanyById, 
    updateCompany, 
    deleteCompany
} from "../controllers/company.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { AdminVerify, CompanyVerify } from "../middlewares/categoryAuth.middleware.js";
const router = Router();
router.use(verifyJWT)
// Define routes using the controller functions
router.route("/").post(AdminVerify, createCompany);
router.route("/").get(AdminVerify, getAllCompanies);
router.route("/:id").get(CompanyVerify, getCompanyById);
router.route("/:id").put(CompanyVerify, updateCompany);
router.route("/:id").delete(AdminVerify, deleteCompany);

export default router;
