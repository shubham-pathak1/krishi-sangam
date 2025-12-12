import {Router} from "express";
import {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { AdminVerify } from "../middlewares/categoryAuth.middleware.js";


const router = Router();
router.use(verifyJWT, AdminVerify)
// Define routes using the controller functions
router.route("/").post(createAdmin);
router.route("/").get(getAllAdmins);
router.route("/?phone").get(getAdminById);
router.route("/:id").put(updateAdmin);
router.route("/:id").delete(deleteAdmin);

export default router;
