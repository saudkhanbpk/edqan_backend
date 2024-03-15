import { subIndustryRepo } from "../data-access-layer/index.js";
import { makeSubIndustry } from "../entities/index.js";

async function createSubIndustryUseCase(subIndustryInfo) {
  const newSubIndustry = await makeSubIndustry(subIndustryInfo);
  return await subIndustryRepo.insert(newSubIndustry);
}

async function getSubIndustrysUseCase(query) {
  return await subIndustryRepo.findAll(query);
}

async function getSubIndustryByIdUseCase(subIndustryId) {
  return await subIndustryRepo.findById(subIndustryId);
}

async function updateSubIndustryByIdUseCase(subIndustryId, subIndustryInfo) {
  return await subIndustryRepo.updateById(subIndustryId, subIndustryInfo);
}

async function deleteSubIndustryByIdUseCase(subIndustryId) {
  return await subIndustryRepo.deleteSubIndustryById(subIndustryId);
}

export default {
  createSubIndustryUseCase,
  getSubIndustryByIdUseCase,
  getSubIndustrysUseCase,
  updateSubIndustryByIdUseCase,
  deleteSubIndustryByIdUseCase,
};
