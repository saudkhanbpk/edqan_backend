import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { resourcesFindingJobUseCase } from "../use-cases/index.js";

async function createResourcesFindingJob(httpRequest) {
  const newResourcesFindingJob = await resourcesFindingJobUseCase.createResourcesFindingJobUseCase(httpRequest.body);
  return successfullyCreatedResponse(newResourcesFindingJob);
}
async function getResourcesFindingJobs(httpRequest) {
  return httpRequest.query.name
    ? successfulResponse(await resourcesFindingJobUseCase.getResourcesFindingJobByNameUseCase(httpRequest.query.name))
    : successfulResponse(await resourcesFindingJobUseCase.getResourcesFindingJobsUseCase());
}
async function getResourcesFindingJobById(httpRequest) {
  return successfulResponse(await resourcesFindingJobUseCase.getResourcesFindingJobByIdUseCase(httpRequest.params._id));
}
async function deleteResourcesFindingJobById(httpRequest) {
  return successfulResponse(await resourcesFindingJobUseCase.deleteResourcesFindingJobByIdUseCase(httpRequest.params._id));
}
async function updateResourcesFindingJobById(httpRequest) {
  return successfulResponse(await resourcesFindingJobUseCase.updateResourcesFindingJobByIdUseCase(httpRequest.params._id, httpRequest.body));
}

export default {
  createResourcesFindingJob,
  getResourcesFindingJobById,
  getResourcesFindingJobs,
  updateResourcesFindingJobById,
  deleteResourcesFindingJobById,
};
