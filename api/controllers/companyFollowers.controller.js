import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { companyFollowersUseCase } from "../use-cases/index.js";

async function createCompanyFollowers(httpRequest) {
  const newCompanyFollowers = await companyFollowersUseCase.createCompanyFollowersUseCase(httpRequest.body);
  return successfullyCreatedResponse(newCompanyFollowers);
}
async function getCompanyFollowerss() {
  return successfulResponse(await companyFollowersUseCase.getCompanyFollowerssUseCase());
}
async function getCompanyFollowersById(httpRequest) {
  return successfulResponse(await companyFollowersUseCase.getCompanyFollowersByIdUseCase(httpRequest.params._id));
}
async function updateCompanyFollowersById(httpRequest) {
  return successfulResponse(await companyFollowersUseCase.updateCompanyFollowersByIdUseCase(httpRequest.params._id, httpRequest.body));
}

export default { createCompanyFollowers, getCompanyFollowersById, getCompanyFollowerss, updateCompanyFollowersById };
