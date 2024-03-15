import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { jobController } from "../controllers/index.js";
import { checkAuth } from "../security/index.js";

router.post("/", expressCallBack(jobController.createJob));
// router.post('/search', expressCallBack(jobController.searchJobs));
router.get("/major/:_id", expressCallBack(jobController.getJobsBasedOnMajor));
router.get("/", checkAuth, expressCallBack(jobController.getJobs));
router.get("/search", expressCallBack(jobController.searchJobs));
router.get("/recent",checkAuth,expressCallBack(jobController.getRecentJobs));
router.get("/:_id",checkAuth,expressCallBack(jobController.getJobById));
router.patch("/:_id", expressCallBack(jobController.updateJobById));
router.delete("/:_id", expressCallBack(jobController.removeJobById));
router.get("/company/:_id", expressCallBack(jobController.findJobsByCompany));
router.patch("/status/:_id", checkAuth, expressCallBack(jobController.approveJobById));
router.get("/dashboard/total-number", expressCallBack(jobController.countJobs));

export default router;
