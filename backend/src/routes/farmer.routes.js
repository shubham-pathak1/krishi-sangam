import { Router } from "express";
import {
  createFarmer,
  getAllFarmers,
  getFarmerById,
  updateFarmer,
  deleteFarmer
} from "../controllers/farmer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { AdminVerify, FarmerVerify } from "../middlewares/categoryAuth.middleware.js";
const router = Router();
router.use(verifyJWT)
// Define routes
router.route("/").post(FarmerVerify, createFarmer);
router.route("/").get(AdminVerify, getAllFarmers);
router.route("/:id").get(FarmerVerify, getFarmerById);
router.route("/:id").put(FarmerVerify, updateFarmer);
router.route("/:id").delete(AdminVerify, deleteFarmer);

export default router;
