import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { workTypeUseCase } from "../use-cases/index.js";

async function createWorkType(httpRequest) {
  const newWorkType = await workTypeUseCase.createWorkTypeUseCase(httpRequest.body);
  return successfullyCreatedResponse(newWorkType);
}
async function getWorkTypes(httpRequest) {
  return successfulResponse(await workTypeUseCase.getWorkTypesUseCase(httpRequest.query));
}
async function getWorkTypeById(httpRequest) {
  return successfulResponse(await workTypeUseCase.getWorkTypeByIdUseCase(httpRequest.params._id));
}
async function updateWorkTypeById(httpRequest) {
  return successfulResponse(await workTypeUseCase.updateWorkTypeByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function removeWorkTypeById(httpRequest) {
  return successfulResponse(await workTypeUseCase.removeWorkTypeByIdUseCase(httpRequest.params._id));
}

export default { createWorkType, getWorkTypeById, getWorkTypes, updateWorkTypeById, removeWorkTypeById };
