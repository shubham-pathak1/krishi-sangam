import { Router } from "express";
import {
  createFeedback,
  getAllFeedback
} from "../controllers/feedback.controller.js";

const router = Router();

router.route("/").post(createFeedback);
router.route("/").get(getAllFeedback);


export default router;

