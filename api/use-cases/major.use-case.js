import { majorRepo } from "../data-access-layer/index.js";

async function createMajorUseCase(majorInfo) {
  return await majorRepo.insert(majorInfo);
}

async function getMajorsUseCase(query) {
  return await majorRepo.findAll(query);
}

async function getMajorByIdUseCase(majorId) {
  return await majorRepo.findById(majorId);
}

async function updateMajorByIdUseCase(majorId, majorInfo) {
  return await majorRepo.updateById(majorId, majorInfo);
}
async function removeMajorByIdUseCase(majorId) {
  return await majorRepo.removeMajorById(majorId);
}

export default {
  createMajorUseCase,
  getMajorsUseCase,
  getMajorByIdUseCase,
  updateMajorByIdUseCase,
  removeMajorByIdUseCase,
};
