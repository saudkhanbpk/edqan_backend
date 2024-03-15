import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { fileUploadService, fileMimeType } from "../helper/fileUploadService.js";
import { companyUseCase } from "../use-cases/index.js";

async function createCompany(httpRequest) {
  let logo = await fileUploadService(httpRequest.originalReqObject, "CompanyLogos", ["logo"], true, fileMimeType.IMAGE);
  const newCompany = await companyUseCase.createCompanyUseCase(logo);
  return successfullyCreatedResponse(newCompany);
}
async function getCompanyById(httpRequest) {
  return successfulResponse(await getCompanyById(httpRequest.params._id));
}
async function getCompanys(httpRequest) {
  return successfulResponse(await companyUseCase.getCompanysUseCase(httpRequest.query, httpRequest.query));
}
async function getStudentFromCompanys(httpRequest) {
  return successfulResponse(await companyUseCase.getStudentFromCompanysUseCase(httpRequest.params._id, httpRequest.paginationQuery));
}
async function updateCompanyById(httpRequest) {
  return successfulResponse(await companyUseCase.updateCompanyByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function getNumberOfDistinctUsersWhoAppliedToJobsInTimeRange(httpRequest) {
  const numberOfUsers = await companyUseCase.getNumberOfDistinctUsersWhoAppliedToJobsInTimeRange(httpRequest.query);
  return successfulResponse(numberOfUsers);
}
async function getNumberOfDistinctUsersWhereStatusIsHiredInTimeRange(httpRequest) {
  const numberOfUsers = await companyUseCase.getNumberOfDistinctUsersByCompanyWhereStatusIsHiredInTimeRange(httpRequest.params._id, httpRequest.query);
  return successfulResponse(numberOfUsers);
}
async function getNumberOfStudentsWhoFollowedCompany(httpRequest) {
  const numberOfUsers = await companyUseCase.getNumberOfStudentsWhoFollowedCompany(httpRequest.params._id);
  return successfulResponse(numberOfUsers);
}
async function findAllUsersWhoViewedAProfile(httpRequest) {
  const numberOfUsers = await companyUseCase.findAllUsersWhoViewedAProfile(httpRequest.params._id, httpRequest.query);
  return successfulResponse(numberOfUsers);
}
async function getStudentsByApplicationStatusAndSort(httpRequest) {
  const numberOfUsers = await companyUseCase.getStudentsByApplicationStatusAndSort(httpRequest.params._id, httpRequest.query);
  return successfulResponse(numberOfUsers);
}
async function getNumberOfDistinctUsersByCompanyWhereStatusIsHiredInTimeRange(httpRequest) {
  const numberOfUsers = await companyUseCase.getNumberOfDistinctUsersByCompanyWhereStatusIsHiredInTimeRange(
    httpRequest.params._id,
    httpRequest.query
  );
  return successfulResponse(numberOfUsers);
}
async function getNumberOfJobViews(httpRequest) {
  const numberOfUsers = await companyUseCase.getNumberOfJobViews(httpRequest.params._id, httpRequest.query.jobId);
  return successfulResponse(numberOfUsers);
}
async function getApplicationsByCompany(httpRequest) {
  return successfulResponse(await companyUseCase.getApplicationsByCompanyUseCase(httpRequest.params._id, httpRequest.paginationQuery));

}

async function getApplicationsByCompanyAndStatus(httpRequest) {
  return successfulResponse(await companyUseCase.getApplicationsByCompanyAndStatusUseCase(httpRequest.params._id, httpRequest.paginationQuery));
}

async function CompaniesThatHiresRemotes(httpRequest) {
  return successfulResponse(await companyUseCase.getCompaniesThatHiresRemotesUseCase(httpRequest.paginationQuery));
}
export default {
  createCompany,
  getCompanyById,
  getCompanys,
  updateCompanyById,
  getStudentFromCompanys,
  getNumberOfDistinctUsersWhoAppliedToJobsInTimeRange,
  getNumberOfDistinctUsersWhereStatusIsHiredInTimeRange,
  getNumberOfStudentsWhoFollowedCompany,
  findAllUsersWhoViewedAProfile,
  getStudentsByApplicationStatusAndSort,
  getNumberOfDistinctUsersByCompanyWhereStatusIsHiredInTimeRange,
  getNumberOfJobViews,
  getApplicationsByCompany,
  getApplicationsByCompanyAndStatus,
  CompaniesThatHiresRemotes
};
