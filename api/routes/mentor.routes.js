import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";
import { checkAuth } from "../security/index.js";

import { mentorController } from "../controllers/index.js";
router.get("/:_id/active-sessions", expressCallBack(mentorController.findByMentorOngoingSessions));
router.get("/:_id/sessions", expressCallBack(mentorController.findByMentorSessions));
router.get("/dashboard/users-mentorshipSession/:_id", expressCallBack(mentorController.findMentorshipSessionByMentor));
router.get("/dashboard/users-viewed-profile/:_id", expressCallBack(mentorController.findAllUsersWhoViewedAProfile));
router.patch("/availabilityTime/:_id", expressCallBack(mentorController.addAvailabilityMentorById));
router.get("/list/in-connect", checkAuth, expressCallBack(mentorController.getMentorsConnection));
router.get("/list",checkAuth,expressCallBack(mentorController.getMentors));
router.get("/delete/availabilityTime/:user", checkAuth, expressCallBack(mentorController.removeDateFromMentorAvailability));


export default router;
