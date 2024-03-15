import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { resourcesFindingJobController } from "../controllers/index.js";

router.post("/", expressCallBack(resourcesFindingJobController.createResourcesFindingJob));
router.get("/:_id", expressCallBack(resourcesFindingJobController.getResourcesFindingJobById));
router.get("/", expressCallBack(resourcesFindingJobController.getResourcesFindingJobs));
router.patch("/:_id", expressCallBack(resourcesFindingJobController.updateResourcesFindingJobById));
router.delete("/:_id", expressCallBack(resourcesFindingJobController.deleteResourcesFindingJobById));

export default router;
