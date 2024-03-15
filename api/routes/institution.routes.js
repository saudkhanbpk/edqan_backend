import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";
import { checkAuth } from "../security/index.js";
import { institutionController } from "../controllers/index.js";
router.get("/students_excel", async (req, res) => {
  try {
    const buffer = await institutionController.getExcelSheet();
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=studentSheet.xlsx");
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/dashboard/users-hired/:_id", expressCallBack(institutionController.getNumberOfStudentsHiredByCompany));
router.get("/applications/:_id", expressCallBack(institutionController.getInstitutionApplications));
router.get("/recently-hired/:_id", expressCallBack(institutionController.getInstitutionApplicationsHired));
router.get("/mentorship-sessions/:_id", expressCallBack(institutionController.findMentorshipSessionByInstitution));
router.get("/mentorship-sessions-ongoing/:_id", expressCallBack(institutionController.findMentorshipSessionByInstitutionOngoing));
router.get("/dashboard/users-followed-institution/:_id", expressCallBack(institutionController.getNumberOfStudentsWhoFollowedInstitution));
router.get("/dashboard/users-viewed-profile/:_id", expressCallBack(institutionController.getNumberOfDistinctUsersWhoViewedAProfileInTimeRange));
router.post("/upload-students", checkAuth, expressCallBack(institutionController.uploadStudentsFromExcel));

router.post("/", expressCallBack(institutionController.createInstitution));
router.get("/", expressCallBack(institutionController.getInstitutions));
router.get("/:_id/profile", expressCallBack(institutionController.getInstitutionById));
router.get("/:_id/student-list", expressCallBack(institutionController.getInstitutionStudents));
router.patch("/:_id", expressCallBack(institutionController.updateInstitutionById));


export default router;
