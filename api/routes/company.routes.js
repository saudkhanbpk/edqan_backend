import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { companyController } from "../controllers/index.js";
router.get("/student-applications/:_id", expressCallBack(companyController.getApplicationsByCompany));
router.get("/student-applications-hired/:_id", expressCallBack(companyController.getApplicationsByCompanyAndStatus));
router.get("/remote-hiring", expressCallBack(companyController.CompaniesThatHiresRemotes));
router.get("/dashboard/users-applied-to-jobs", expressCallBack(companyController.getNumberOfDistinctUsersWhoAppliedToJobsInTimeRange));
router.get("/dashboard/users-followed-company/:_id", expressCallBack(companyController.getNumberOfStudentsWhoFollowedCompany));
router.get("/dashboard/users-viewed-profile/:_id", expressCallBack(companyController.findAllUsersWhoViewedAProfile));
router.get("/dashboard/job-views/:_id", expressCallBack(companyController.getNumberOfJobViews));
router.get("/dashboard/students-applications/:_id", expressCallBack(companyController.getStudentsByApplicationStatusAndSort));
router.get("/dashboard/users-hired/:_id", expressCallBack(companyController.getNumberOfDistinctUsersByCompanyWhereStatusIsHiredInTimeRange));
router.post("/", expressCallBack(companyController.createCompany));
router.get("/hired_students/:_id", expressCallBack(companyController.getStudentFromCompanys));
router.get("/:_id", expressCallBack(companyController.getCompanyById));
router.get("/", expressCallBack(companyController.getCompanys));
router.patch("/:_id", expressCallBack(companyController.updateCompanyById));

export default router;
