import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { mentorShipGuideLineController } from "../controllers/index.js";

router.post("/", expressCallBack(mentorShipGuideLineController.createMentorShipGuideLine));
router.get("/:_id", expressCallBack(mentorShipGuideLineController.getMentorShipGuideLineById));
router.get("/", expressCallBack(mentorShipGuideLineController.getMentorShipGuideLines));
router.patch("/:_id", expressCallBack(mentorShipGuideLineController.updateMentorShipGuideLineById));
router.delete("/:_id", expressCallBack(mentorShipGuideLineController.removeMentorShipGuideLineById));

export default router;
