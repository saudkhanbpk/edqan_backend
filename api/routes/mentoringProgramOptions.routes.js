import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { mentoringProgramOptionsController } from "../controllers/index.js";

router.post("/", expressCallBack(mentoringProgramOptionsController.createMentoringProgramOptions));
router.get("/:_id", expressCallBack(mentoringProgramOptionsController.getMentoringProgramOptionsById));
router.get("/", expressCallBack(mentoringProgramOptionsController.getMentoringProgramOptions));
router.patch("/:_id", expressCallBack(mentoringProgramOptionsController.updateMentoringProgramOptionsById));
router.delete("/:_id", expressCallBack(mentoringProgramOptionsController.deleteMentoringProgramOptionsById));

export default router;
