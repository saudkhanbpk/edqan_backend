import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { jobRoleUseCase } from "../use-cases/index.js";

async function createJobRole(httpRequest) {
  const newJobRole = await jobRoleUseCase.createJobRoleUseCase(httpRequest.body);
  return successfullyCreatedResponse(newJobRole);
}
async function getJobRoles(httpRequest) {
  return successfulResponse(await jobRoleUseCase.getJobRolesUseCase(httpRequest.query));
}
async function getJobRoleById(httpRequest) {
  return successfulResponse(await jobRoleUseCase.getJobRoleByIdUseCase(httpRequest.params._id));
}
async function updateJobRoleById(httpRequest) {
  return successfulResponse(await jobRoleUseCase.updateJobRoleByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function removeJobRoleById(httpRequest) {
  return successfulResponse(await jobRoleUseCase.removeJobRoleByIdUseCase(httpRequest.params._id));
}

export default { createJobRole, getJobRoleById, getJobRoles, updateJobRoleById, removeJobRoleById };
