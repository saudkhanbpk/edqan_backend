import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { educationLevelGroupController } from "../controllers/index.js";

router.post("/", expressCallBack(educationLevelGroupController.createEducationLevelGroup));
router.get("/fields/:educationLevelGroupId", expressCallBack(educationLevelGroupController.getEducationLevelGroupByEducationLevel));
router.get("/:_id", expressCallBack(educationLevelGroupController.getEducationLevelGroupById));
router.get("/", expressCallBack(educationLevelGroupController.getEducationLevelGroups));
router.patch("/:_id", expressCallBack(educationLevelGroupController.updateEducationLevelGroupById));

export default router;
