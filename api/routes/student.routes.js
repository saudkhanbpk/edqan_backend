import express from "express";
import { checkAuth } from "../security/index.js";
import expressCallBack from "../helper/express-callback.js";

const router = express.Router();

import { studentController } from "../controllers/index.js";

router.patch("/:userId/career_interest", checkAuth, expressCallBack(studentController.updateCareerInterest));
router.get("/dashboard/active-session/:userId",  expressCallBack(studentController.getMentorshipSessionByStudent));
router.get("/dashboard/interaction-employer/:userId",  expressCallBack(studentController.getApplicationsByUser));
router.get("/saved_jobs/:userId", checkAuth, expressCallBack(studentController.getSavedJobs));
router.get("/major/:majorId", checkAuth, expressCallBack(studentController.getStudentsByMajorId));
router.get("/followed_company/:userId", checkAuth, expressCallBack(studentController.getFollowedCompany));
router.get("/", expressCallBack(studentController.getStudents));
router.patch("/add_job_major", checkAuth, expressCallBack(studentController.addjobMajor));
router.patch("/save_job", expressCallBack(studentController.saveJob));
router.patch("/follow_company", checkAuth, expressCallBack(studentController.followCompany));
router.patch("/follow_institution", checkAuth, expressCallBack(studentController.followInstitution));
router.get("/companiesThatHiresFromStudentsInstitution", checkAuth, expressCallBack(studentController.getCompaniesThatHiresFromStudentsInstitution));
router.get("/mentor_sessions/:_id", checkAuth, expressCallBack(studentController.getMentorSessions));
router.post("/request_mentor", checkAuth, expressCallBack(studentController.requestMentor));

export default router;
