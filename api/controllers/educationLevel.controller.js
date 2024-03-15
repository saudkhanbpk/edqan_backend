import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { educationLevelUseCase } from "../use-cases/index.js";

async function createEducationalLevel(httpRequest) {
  const newEducationalLevel = await educationLevelUseCase.createEducationalLevelUseCase(httpRequest.body);
  return successfullyCreatedResponse(newEducationalLevel);
}
async function getEducationalLevels(httpRequest) {
  return successfulResponse(await educationLevelUseCase.getEducationalLevelsUseCase(httpRequest.query));
}
async function getEducationalLevelById(httpRequest) {
  return successfulResponse(await educationLevelUseCase.getEducationalLevelByIdUseCase(httpRequest.params._id));
}
async function updateEducationalLevelById(httpRequest) {
  return successfulResponse(await educationLevelUseCase.updateEducationalLevelByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function removeEducationalLevelById(httpRequest) {
  return successfulResponse(await educationLevelUseCase.removeEducationalLevelByIdUseCase(httpRequest.params._id));
}

export default { createEducationalLevel, getEducationalLevelById, getEducationalLevels, updateEducationalLevelById, removeEducationalLevelById };
