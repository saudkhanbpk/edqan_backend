import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";
import { checkAuth } from "../security/index.js";

import { meetingController } from "../controllers/index.js";

router.post("/", checkAuth, expressCallBack(meetingController.createMeeting));
router.get("/", checkAuth, expressCallBack(meetingController.getMeetings));
router.get("/calendar", checkAuth, expressCallBack(meetingController.findAllMeetingsCalendar));
router.get("/mentor", checkAuth, expressCallBack(meetingController.getMeetings));
router.get("/mentor/mentees-requests", checkAuth, expressCallBack(meetingController.getMeetingsPending));
router.patch("/status/:_id", checkAuth, expressCallBack(meetingController.updateMeetingStatus));
router.patch("/mentor-rating/:_id", expressCallBack(meetingController.updateMeetingMentorRating));
router.patch("/mentee-rating/:_id", expressCallBack(meetingController.updateMeetingMenteeRating));
router.patch("/:_id", checkAuth, expressCallBack(meetingController.updateMeetingById));
router.get("/:_id", expressCallBack(meetingController.getMeetingById));
router.get("/dashboard/sessions/completed", expressCallBack(meetingController.getAllSessionCompleted));

export default router;
