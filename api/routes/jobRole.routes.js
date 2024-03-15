import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { jobRoleController } from "../controllers/index.js";

router.post("/", expressCallBack(jobRoleController.createJobRole));
router.get("/:_id", expressCallBack(jobRoleController.getJobRoleById));
router.get("/", expressCallBack(jobRoleController.getJobRoles));
router.patch("/:_id", expressCallBack(jobRoleController.updateJobRoleById));
router.delete("/:_id", expressCallBack(jobRoleController.removeJobRoleById));

export default router;
