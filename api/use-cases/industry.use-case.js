import { industryRepo } from "../data-access-layer/index.js";

async function createIndustryUseCase(industryInfo) {
  const newIndustry = await makeIndustry(industryInfo);
  return await industryRepo.insert(newIndustry);
}
async function getIndustrysUseCase(industryInfo) {
  return await industryRepo.findAll();
}

async function getIndustryByIdUseCase(industryId) {
  return await industryRepo.findById(industryId);
}
async function updateIndustryByIdUseCase(industryId, industryInfo) {
  return await industryRepo.updateById(industryId, industryInfo);
}

async function deleteIndustryByIdUseCase(industryId) {
  return await industryRepo.deleteIndustryById(industryId);
}

export default {
  createIndustryUseCase,
  getIndustrysUseCase,
  getIndustryByIdUseCase,
  updateIndustryByIdUseCase,
  deleteIndustryByIdUseCase,
};
