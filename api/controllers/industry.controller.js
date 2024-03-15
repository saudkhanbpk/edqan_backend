import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { industryUseCase } from "../use-cases/index.js";

async function createIndustry(httpRequest) {
  const newIndustry = await industryUseCase.createIndustryUseCase(httpRequest.body);
  return successfullyCreatedResponse(newIndustry);
}
async function getIndustrys() {
  return successfulResponse(await industryUseCase.getIndustrysUseCase());
}
async function getIndustryById(httpRequest) {
  return successfulResponse(await industryUseCase.getIndustryByIdUseCase(httpRequest.params._id));
}
async function updateIndustryById(httpRequest) {
  return successfulResponse(await industryUseCase.updateIndustryByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function deleteIndustryById(httpRequest) {
  return successfulResponse(await industryUseCase.deleteIndustryByIdUseCase(httpRequest.params._id));
}

export default { createIndustry, getIndustryById, getIndustrys, updateIndustryById, deleteIndustryById };
