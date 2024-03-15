import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { meetingDurationController } from "../controllers/index.js";

router.post("/", expressCallBack(meetingDurationController.createMeetingDuration));
router.get("/", expressCallBack(meetingDurationController.getMeetingDurations));
router.get("/:_id", expressCallBack(meetingDurationController.getMeetingDurationById));
router.patch("/:_id", expressCallBack(meetingDurationController.updateMeetingDurationById));

export default router;
