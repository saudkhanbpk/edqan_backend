import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { jobUseCase } from "../use-cases/index.js";

async function createJob(httpRequest) {
  const newJob = await jobUseCase.createJobUseCase(httpRequest.body, httpRequest.query.companyId);
  return successfullyCreatedResponse(newJob);
}
async function getJobs(httpRequest) {
  if (httpRequest.user?.model=="Student") httpRequest.query.status = 'approved';
  return successfulResponse(await jobUseCase.getJobsUseCase(httpRequest.query, httpRequest.paginationQuery));
}
async function getJobById(httpRequest) {
  let user;
  if (httpRequest.user?.model=="Student") {user =httpRequest.user;}
  return successfulResponse(await jobUseCase.getJobByIdUseCase(httpRequest.params._id, httpRequest.query.save, httpRequest.query.userId,user));
}
async function updateJobById(httpRequest) {
  if (httpRequest.body.approved) httpRequest.body.approved = false;
  if (httpRequest.admin && httpRequest.body.approved) throw new Error("please approve job from approve api");
  return successfulResponse(await jobUseCase.updateJobByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function getRecentJobs(httpRequest) {
  return successfulResponse(await jobUseCase.getRecentJobsUseCase(httpRequest.user,httpRequest.query));
}
async function getJobsBasedOnMajor(httpRequest) {
 
  return successfulResponse(await jobUseCase.getJobsBasedOnMajor(httpRequest.params._id,httpRequest.query, httpRequest.paginationQuery));
}
async function searchJobs(httpRequest) {
  return successfulResponse(await jobUseCase.searchUseCase(httpRequest.body.searchData, httpRequest.query));
}
async function removeJobById(httpRequest) {
  return successfulResponse(await jobUseCase.removeJobByIdUseCase(httpRequest.params._id));
}
async function findJobsByCompany(httpRequest) {
  return successfulResponse(await jobUseCase.findJobsByCompany(httpRequest.params._id, httpRequest.paginationQuery));
}
async function approveJobById(httpRequest) {
  // if (httpRequest.user) throw new Error("Unauthorized to make this request");
  return successfulResponse(await jobUseCase.approveJobByIdUseCase(httpRequest.params._id, httpRequest.query.status));
}
async function countJobs(httpRequest) {
  return successfulResponse(await jobUseCase.countJobsUseCase());
}

export default {
  createJob,
  getJobById,
  getJobs,
  getRecentJobs,
  updateJobById,
  getJobsBasedOnMajor,
  searchJobs,
  removeJobById,
  findJobsByCompany,
  approveJobById,
  countJobs,
};
