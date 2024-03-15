import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { subIndustryUseCase } from "../use-cases/index.js";

async function createSubIndustry(httpRequest) {
  const newSubIndustry = await subIndustryUseCase.createSubIndustryUseCase(httpRequest.body);
  return successfullyCreatedResponse(newSubIndustry);
}
async function getSubIndustrys(httpRequest) {
  return successfulResponse(await subIndustryUseCase.getSubIndustrysUseCase(httpRequest.query));
}
async function getSubIndustryById(httpRequest) {
  return successfulResponse(await subIndustryUseCase.getSubIndustryByIdUseCase(httpRequest.params._id));
}
async function updateSubIndustryById(httpRequest) {
  return successfulResponse(await subIndustryUseCase.updateSubIndustryByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function deleteSubIndustryById(httpRequest) {
  return successfulResponse(await subIndustryUseCase.deleteSubIndustryByIdUseCase(httpRequest.params._id));
}

export default { createSubIndustry, getSubIndustryById, getSubIndustrys, updateSubIndustryById, deleteSubIndustryById };
