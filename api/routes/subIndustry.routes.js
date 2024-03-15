import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { subIndustryController } from "../controllers/index.js";

router.post("/", expressCallBack(subIndustryController.createSubIndustry));
router.get("/:_id", expressCallBack(subIndustryController.getSubIndustryById));
router.get("/", expressCallBack(subIndustryController.getSubIndustrys));
router.patch("/:_id", expressCallBack(subIndustryController.updateSubIndustryById));
router.delete("/:_id", expressCallBack(subIndustryController.deleteSubIndustryById));

export default router;
