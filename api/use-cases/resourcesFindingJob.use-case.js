import { resourcesFindingJobRepo } from "../data-access-layer/index.js";
import { makeResourcesFindingJob } from "../entities/index.js";

async function createResourcesFindingJobUseCase(resourcesFindingJobInfo) {
  const newResourcesFindingJob = await makeResourcesFindingJob(resourcesFindingJobInfo);
  return await resourcesFindingJobRepo.insert(newResourcesFindingJob);
}

async function getResourcesFindingJobsUseCase(resourcesFindingJobInfo) {
  return await resourcesFindingJobRepo.findAll();
}

async function getResourcesFindingJobByIdUseCase(resourcesFindingJobId) {
  return await resourcesFindingJobRepo.findById(resourcesFindingJobId);
}

async function deleteResourcesFindingJobByIdUseCase(resourcesFindingJobId) {
  return await resourcesFindingJobRepo.deleteResourcesFindingJobById(resourcesFindingJobId);
}

async function getResourcesFindingJobByNameUseCase(resourcesFindingJobName) {
  return await resourcesFindingJobRepo.findByName(resourcesFindingJobName);
}

async function updateResourcesFindingJobByIdUseCase(resourcesFindingJobId, resourcesFindingJobInfo) {
  return await resourcesFindingJobRepo.updateById(resourcesFindingJobId, resourcesFindingJobInfo);
}

export default {
  createResourcesFindingJobUseCase,
  getResourcesFindingJobsUseCase,
  getResourcesFindingJobByIdUseCase,
  updateResourcesFindingJobByIdUseCase,
  getResourcesFindingJobByNameUseCase,
  deleteResourcesFindingJobByIdUseCase,
};
