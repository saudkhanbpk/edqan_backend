import { companyGuideLineRepo } from "../data-access-layer/index.js";
import { makeCompanyGuideLine } from "../entities/index.js";

async function createCompanyGuideLineUseCase(companyGuideLineInfo) {
  const newCompanyGuideLine = await makeCompanyGuideLine(companyGuideLineInfo);
  return await companyGuideLineRepo.insert(newCompanyGuideLine);
}

async function getCompanyGuideLinesUseCase(companyGuideLineInfo) {
  return await companyGuideLineRepo.findAll();
}

async function getCompanyGuideLineByIdUseCase(companyGuideLineId) {
  return await companyGuideLineRepo.findById(companyGuideLineId);
}

async function updateCompanyGuideLineByIdUseCase(companyGuideLineId, companyGuideLineInfo) {
  return await companyGuideLineRepo.updateById(companyGuideLineId, companyGuideLineInfo);
}

async function removeCompanyGuideLineByIdUseCase(companyGuideLineId) {
  return await companyGuideLineRepo.removeCompanyGuideLineById(companyGuideLineId);
}

export default {
  createCompanyGuideLineUseCase,
  getCompanyGuideLinesUseCase,
  getCompanyGuideLineByIdUseCase,
  updateCompanyGuideLineByIdUseCase,
  removeCompanyGuideLineByIdUseCase,
};
