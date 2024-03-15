import { successfullyCreatedResponse, successfullyUpdatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { studentUseCase } from "../use-cases/index.js";

async function getCompaniesThatHiresFromStudentsInstitution(httpRequest) {
  return successfulResponse(
    await studentUseCase.getCompaniesThatHiresFromStudentsInstitutionUseCase(httpRequest.query.userId, httpRequest.paginationQuery)
  );
}
async function requestMentor(httpRequest) {
  const newStudent = await studentUseCase.requestMentorUseCase(httpRequest.query.userId, httpRequest.body);
  return successfullyCreatedResponse(newStudent);
}
async function getStudents() {
  return successfulResponse(await studentUseCase.getStudentsUseCase());
}
async function updateCareerInterest(httpRequest) {
  return successfulResponse(await studentUseCase.updateCareerInterestUseCase(httpRequest.params.userId, httpRequest.body));
}
async function addjobMajor(httpRequest) {
  await studentUseCase.addjobMajorUseCase(httpRequest.query.userId, httpRequest.body);
  return successfulResponse();
}
async function saveJob(httpRequest) {
  await studentUseCase.saveJobUseCase(httpRequest.query.userId, httpRequest.body);
  return successfulResponse();
}
async function followCompany(httpRequest) {
  await studentUseCase.followCompanyUseCase(httpRequest.query.userId, httpRequest.body);
  return successfulResponse();
}
async function followInstitution(httpRequest) {
  await studentUseCase.followInstitutionUseCase(httpRequest.query.userId, httpRequest.body.followedInstitutions);
  return successfulResponse();
}
async function getSavedJobs(httpRequest) {
  return successfulResponse(await studentUseCase.getSavedJobsUseCase(httpRequest.params.userId, httpRequest.query.populate == "true" ? true : false));
}
async function getMentorSessions(httpRequest) {
  return successfulResponse(
    await studentUseCase.getMentorSessionsUseCase(httpRequest.params._id, httpRequest.query.status, httpRequest.paginationQuery)
  );
}
async function getFollowedCompany(httpRequest) {
  return successfulResponse(await studentUseCase.getFollowedCompanyUseCase(httpRequest.params.userId, httpRequest.body));
}

// get students by major id
async function getStudentsByMajorId(httpRequest) {
  return successfulResponse(await studentUseCase.getStudentsByMajorIdUseCase(httpRequest.params.majorId));
}


async function getApplicationsByUser(httpRequest) {
  return successfulResponse(await studentUseCase.getApplicationsByUser(httpRequest.params.userId, httpRequest.paginationQuery));
}

async function getMentorshipSessionByStudent(httpRequest) {
  return successfulResponse(await studentUseCase.getMentorshipSessionByStudentUseCase(httpRequest.params.userId, httpRequest.paginationQuery));
}

export default {
  getStudents,
  updateCareerInterest,
  addjobMajor,
  saveJob,
  followCompany,
  getFollowedCompany,
  getSavedJobs,
  requestMentor,
  getMentorSessions,
  getCompaniesThatHiresFromStudentsInstitution,
  getStudentsByMajorId,
  followInstitution,
  getApplicationsByUser,
  getMentorshipSessionByStudent,
};
