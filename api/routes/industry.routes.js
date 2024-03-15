import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { industryController } from "../controllers/index.js";

router.post("/", expressCallBack(industryController.createIndustry));
router.get("/", expressCallBack(industryController.getIndustrys));
router.get("/:_id", expressCallBack(industryController.getIndustryById));
router.patch("/:_id", expressCallBack(industryController.updateIndustryById));
router.delete("/:_id", expressCallBack(industryController.deleteIndustryById));

export default router;
