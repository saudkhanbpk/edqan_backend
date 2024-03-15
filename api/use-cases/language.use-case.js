import { languageRepo } from "../data-access-layer/index.js";
import { makeLanguage } from "../entities/index.js";

async function createLanguageUseCase(languageInfo) {
  const newLanguage = await makeLanguage(languageInfo);
  return await languageRepo.insert(newLanguage);
}

async function getLanguagesUseCase(languageInfo) {
  return await languageRepo.findAll(languageInfo);
}

async function getLanguageByIdUseCase(languageId) {
  return await languageRepo.findById(languageId);
}

async function updateLanguageByIdUseCase(languageId, languageInfo) {
  return await languageRepo.updateById(languageId, languageInfo);
}

async function removeLanguageByIdUseCase(languageId) {
  return await languageRepo.removeLanguageById(languageId);
}

export default {
  createLanguageUseCase,
  getLanguagesUseCase,
  getLanguageByIdUseCase,
  updateLanguageByIdUseCase,
  removeLanguageByIdUseCase,
};
