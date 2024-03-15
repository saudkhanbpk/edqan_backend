import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { educationLevelController } from "../controllers/index.js";

router.post("/", expressCallBack(educationLevelController.createEducationalLevel));
router.get("/:_id", expressCallBack(educationLevelController.getEducationalLevelById));
router.get("/", expressCallBack(educationLevelController.getEducationalLevels));
router.patch("/:_id", expressCallBack(educationLevelController.updateEducationalLevelById));
router.delete("/:_id", expressCallBack(educationLevelController.removeEducationalLevelById));
export default router;
