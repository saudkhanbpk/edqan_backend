import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { mentorShipTypeController } from "../controllers/index.js";

router.post("/", expressCallBack(mentorShipTypeController.createMentorShipType));
router.get("/:_id", expressCallBack(mentorShipTypeController.getMentorShipTypeById));
router.get("/", expressCallBack(mentorShipTypeController.getMentorShipTypes));
router.patch("/:_id", expressCallBack(mentorShipTypeController.updateMentorShipTypeById));
router.delete("/:_id", expressCallBack(mentorShipTypeController.removeMentorShipTypeById));

export default router;
