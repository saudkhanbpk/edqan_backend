import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { companyGuidelineController } from "../controllers/index.js";

router.post("/", expressCallBack(companyGuidelineController.createCompanyGuideLine));
router.get("/:_id", expressCallBack(companyGuidelineController.getCompanyGuideLineById));
router.get("/", expressCallBack(companyGuidelineController.getCompanyGuideLines));
router.patch("/:_id", expressCallBack(companyGuidelineController.updateCompanyGuideLineById));
router.delete("/:_id", expressCallBack(companyGuidelineController.removeCompanyGuideLineById));

export default router;
