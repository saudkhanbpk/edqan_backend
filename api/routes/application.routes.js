import express from "express";
import { checkAuth } from "../security/index.js";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { applicationController } from "../controllers/index.js";

router.post("/", checkAuth, expressCallBack(applicationController.createApplication));
router.get("/user/:userId", expressCallBack(applicationController.getApplications));
router.get("/job/:jobId", expressCallBack(applicationController.getApplicationByJobId));
router.get("/:_id", expressCallBack(applicationController.getApplicationById));
router.patch("/:_id", expressCallBack(applicationController.updateApplicationById));

export default router;
