import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { jobTypeUseCase } from "../use-cases/index.js";

async function createJobType(httpRequest) {
  const newJobType = await jobTypeUseCase.createJobTypeUseCase(httpRequest.body);
  return successfullyCreatedResponse(newJobType);
}
async function getJobTypes(httpRequest) {
  return successfulResponse(await jobTypeUseCase.getJobTypesUseCase(httpRequest.query));
}
async function getJobTypeById(httpRequest) {
  return successfulResponse(await jobTypeUseCase.getJobTypeByIdUseCase(httpRequest.params._id));
}
async function updateJobTypeById(httpRequest) {
  return successfulResponse(await jobTypeUseCase.updateJobTypeByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function removeJobTypeById(httpRequest) {
  return successfulResponse(await jobTypeUseCase.removeJobTypeByIdUseCase(httpRequest.params._id));
}

export default { createJobType, getJobTypeById, getJobTypes, updateJobTypeById, removeJobTypeById };
