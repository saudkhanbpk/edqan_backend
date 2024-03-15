import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { jobTypeController } from "../controllers/index.js";

router.post("/", expressCallBack(jobTypeController.createJobType));
router.get("/:_id", expressCallBack(jobTypeController.getJobTypeById));
router.get("/", expressCallBack(jobTypeController.getJobTypes));
router.patch("/:_id", expressCallBack(jobTypeController.updateJobTypeById));
router.delete("/:_id", expressCallBack(jobTypeController.removeJobTypeById));

export default router;
