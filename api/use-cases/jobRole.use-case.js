import { jobRoleRepo } from "../data-access-layer/index.js";
import { makeJobRole } from "../entities/index.js";

async function createJobRoleUseCase(jobRoleInfo) {
  const newJobRole = await makeJobRole(jobRoleInfo);
  return await jobRoleRepo.insert(newJobRole);
}

async function getJobRolesUseCase(query) {
  return await jobRoleRepo.findAll(query);
}

async function getJobRoleByIdUseCase(jobRoleId) {
  return await jobRoleRepo.findById(jobRoleId);
}

async function updateJobRoleByIdUseCase(jobRoleId, jobRoleInfo) {
  return await jobRoleRepo.updateById(jobRoleId, jobRoleInfo);
}

async function removeJobRoleByIdUseCase(jobRoleId) {
  return await jobRoleRepo.removeJobRoleById(jobRoleId);
}

export default {
  createJobRoleUseCase,
  getJobRolesUseCase,
  getJobRoleByIdUseCase,
  updateJobRoleByIdUseCase,
  removeJobRoleByIdUseCase,
};
