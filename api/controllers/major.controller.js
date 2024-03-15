import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { majorUseCase } from "../use-cases/index.js";

async function createMajor(httpRequest) {
  const newMajor = await majorUseCase.createMajorUseCase(httpRequest.body);
  return successfullyCreatedResponse(newMajor);
}
async function getMajors(httpRequest) {
  return successfulResponse(await majorUseCase.getMajorsUseCase(httpRequest.query));
}
async function getMajorById(httpRequest) {
  return successfulResponse(await majorUseCase.getMajorByIdUseCase(httpRequest.params._id));
}
async function updateMajorById(httpRequest) {
  return successfulResponse(await majorUseCase.updateMajorByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function removeMajorById(httpRequest) {
  return successfulResponse(await majorUseCase.removeMajorByIdUseCase(httpRequest.params._id));
}

export default { createMajor, getMajorById, getMajors, updateMajorById, removeMajorById };
