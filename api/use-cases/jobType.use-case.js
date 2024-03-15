import { jobTypeRepo } from "../data-access-layer/index.js";
import { makeJobType } from "../entities/index.js";

async function createJobTypeUseCase(jobTypeInfo) {
  const newJobType = await makeJobType(jobTypeInfo);
  return await jobTypeRepo.insert(newJobType);
}

async function getJobTypesUseCase(query) {
  return await jobTypeRepo.findAll(query);
}

async function getJobTypeByIdUseCase(jobTypeId) {
  return await jobTypeRepo.findById(jobTypeId);
}

async function updateJobTypeByIdUseCase(jobTypeId, jobTypeInfo) {
  return await jobTypeRepo.updateById(jobTypeId, jobTypeInfo);
}

async function removeJobTypeByIdUseCase(jobTypeId) {
  return await jobTypeRepo.removeJobTypeById(jobTypeId);
}

export default {
  createJobTypeUseCase,
  getJobTypesUseCase,
  getJobTypeByIdUseCase,
  updateJobTypeByIdUseCase,
  removeJobTypeByIdUseCase,
};
