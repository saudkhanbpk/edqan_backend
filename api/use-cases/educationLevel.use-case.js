import { educationLevelRepo } from "../data-access-layer/index.js";
import { makeEducationLevel } from "../entities/index.js";

async function createEducationalLevelUseCase(educationalLevelInfo) {
  const newEducationalLevel = await makeEducationLevel(educationalLevelInfo);
  return await educationLevelRepo.insert(newEducationalLevel);
}

async function getEducationalLevelsUseCase(query) {
  return await educationLevelRepo.findAll(query);
}

async function getEducationalLevelByIdUseCase(educationalLevelId) {
  return await educationLevelRepo.findById(educationalLevelId);
}

async function updateEducationalLevelByIdUseCase(educationalLevelId, educationalLevelInfo) {
  return await educationLevelRepo.updateById(educationalLevelId, educationalLevelInfo);
}

async function removeEducationalLevelByIdUseCase(educationalLevelId) {
  return await educationLevelRepo.removeById(educationalLevelId);
}

export default {
  createEducationalLevelUseCase,
  getEducationalLevelsUseCase,
  getEducationalLevelByIdUseCase,
  updateEducationalLevelByIdUseCase,
  removeEducationalLevelByIdUseCase,
};
