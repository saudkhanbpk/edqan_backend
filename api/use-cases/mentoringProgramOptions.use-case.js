import { mentoringProgramOptionRepo } from "../data-access-layer/index.js";
import { makeMentoringProgramOptions } from "../entities/index.js";

async function createMentoringProgramOptionsUseCase(mentoringProgramOptionsInfo) {
  const newMentoringProgramOptions = await makeMentoringProgramOptions(mentoringProgramOptionsInfo);
  return await mentoringProgramOptionRepo.insert(newMentoringProgramOptions);
}

async function getMentoringProgramOptionsUseCase() {
  return await mentoringProgramOptionRepo.findAll();
}

async function getMentoringProgramOptionsByIdUseCase(mentoringProgramOptionsId) {
  return await mentoringProgramOptionRepo.findById(mentoringProgramOptionsId);
}

async function deleteMentoringProgramOptionsByIdUseCase(mentoringProgramOptionsId) {
  return await mentoringProgramOptionRepo.deleteMentoringProgramOptionsById(mentoringProgramOptionsId);
}

async function getMentoringProgramOptionsByNameUseCase(mentoringProgramOptions) {
  return await mentoringProgramOptionRepo.findByName(mentoringProgramOptions);
}

async function updateMentoringProgramOptionsByIdUseCase(mentoringProgramOptionsId, mentoringProgramOptionsInfo) {
  return await mentoringProgramOptionRepo.updateById(mentoringProgramOptionsId, mentoringProgramOptionsInfo);
}

export default {
  createMentoringProgramOptionsUseCase,
  getMentoringProgramOptionsUseCase,
  getMentoringProgramOptionsByIdUseCase,
  updateMentoringProgramOptionsByIdUseCase,
  getMentoringProgramOptionsByNameUseCase,
  deleteMentoringProgramOptionsByIdUseCase,
};
