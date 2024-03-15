import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { companyGuideLineUseCase } from "../use-cases/index.js";

async function createCompanyGuideLine(httpRequest) {
  const newCompanyGuideLine = await companyGuideLineUseCase.createCompanyGuideLineUseCase(httpRequest.body);
  return successfullyCreatedResponse(newCompanyGuideLine);
}
async function getCompanyGuideLines() {
  return successfulResponse(await companyGuideLineUseCase.getCompanyGuideLinesUseCase());
}
async function getCompanyGuideLineById(httpRequest) {
  return successfulResponse(await companyGuideLineUseCase.getCompanyGuideLineByIdUseCase(httpRequest.params._id));
}
async function updateCompanyGuideLineById(httpRequest) {
  return successfulResponse(await companyGuideLineUseCase.updateCompanyGuideLineByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function removeCompanyGuideLineById(httpRequest) {
  return successfulResponse(await companyGuideLineUseCase.removeCompanyGuideLineByIdUseCase(httpRequest.params._id));
}

export default { createCompanyGuideLine, getCompanyGuideLineById, getCompanyGuideLines, updateCompanyGuideLineById, removeCompanyGuideLineById };
