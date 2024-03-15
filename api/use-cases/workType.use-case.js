import { workTypeRepo } from "../data-access-layer/index.js";
import { makeWorkType } from "../entities/index.js";

async function createWorkTypeUseCase(workTypeInfo) {
  const newWorkType = await makeWorkType(workTypeInfo);
  return await workTypeRepo.insert(newWorkType);
}

async function getWorkTypesUseCase(query) {
  return await workTypeRepo.findAll(query);
}

async function getWorkTypeByIdUseCase(workTypeId) {
  return await workTypeRepo.findById(workTypeId);
}

async function updateWorkTypeByIdUseCase(workTypeId, workTypeInfo) {
  return await workTypeRepo.updateById(workTypeId, workTypeInfo);
}

async function removeWorkTypeByIdUseCase(workTypeId) {
  return await workTypeRepo.removeWorkTypeById(workTypeId);
}

export default {
  createWorkTypeUseCase,
  getWorkTypeByIdUseCase,
  getWorkTypesUseCase,
  updateWorkTypeByIdUseCase,
  removeWorkTypeByIdUseCase,
};
