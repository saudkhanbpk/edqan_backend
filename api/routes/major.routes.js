import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { majorController } from "../controllers/index.js";

router.post("/", expressCallBack(majorController.createMajor));
router.get("/", expressCallBack(majorController.getMajors));
router.get("/:_id", expressCallBack(majorController.getMajorById));
router.patch("/:_id", expressCallBack(majorController.updateMajorById));
router.delete("/:_id", expressCallBack(majorController.removeMajorById));

export default router;
