import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { checkAuth } from "../security/index.js";

import { adminController } from "../controllers/index.js";

router.patch("/change-password", checkAuth, expressCallBack(adminController.updatePassword));
router.get("/dashboard/users-by-type/:model", expressCallBack(adminController.getNumberOfUsersByType));
router.get("/dashboard/users-completed-profile", expressCallBack(adminController.getNumberOfUsersWhoCompletedProfile));
router.get("/dashboard/users-added-in-time-period", expressCallBack(adminController.getNumberOfUsersAddedInTimePeriod));
router.get("/dashboard/users-applied-to-jobs", expressCallBack(adminController.getNumberOfDistinctUsersWhoAppliedToJobsInTimeRange));
router.get("/dashboard/users-hired", expressCallBack(adminController.getNumberOfDistinctUsersWhereStatusIsHiredInTimeRange));
router.get("/dashboard/users-followed-company/:_id", expressCallBack(adminController.getNumberOfStudentsWhoFollowedCompany));
router.get("/dashboard/users-followed-institution/:_id", expressCallBack(adminController.getNumberOfStudentsWhoFollowedInstitution));
router.get("/dashboard/users-mentorship-sessions", expressCallBack(adminController.findMentorshipSessionByMentor));
router.post("/", expressCallBack(adminController.addAdmin));
router.post("/login", expressCallBack(adminController.adminLogin));
router.patch("/:_id", expressCallBack(adminController.updateAdmin));
router.get("/:_id", expressCallBack(adminController.getAdminById));
router.get("/", expressCallBack(adminController.getAdmins));
router.delete("/:_id", expressCallBack(adminController.deleteAdmin));
router.get("/reset-password/:userEmail", expressCallBack(adminController.generateAndSendAdminPasswordReset));
router.post("/reset-password/:_id", expressCallBack(adminController.resetUserPassword));

export default router;
