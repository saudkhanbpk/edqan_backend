import { companyFollowersRepo } from "../data-access-layer/index.js";
import { makeCompanyFollowers } from "../entities/index.js";

async function createCompanyFollowersUseCase(companyFollowersInfo) {
  const newCompanyFollowers = await makeCompanyFollowers(companyFollowersInfo);
  return await companyFollowersRepo.insert(newCompanyFollowers);
}

async function getCompanyFollowerssUseCase(companyFollowersInfo) {
  return await companyFollowersRepo.findAll();
}

async function getCompanyFollowersByIdUseCase(companyFollowersId) {
  return await companyFollowersRepo.findById(companyFollowersId);
}

async function updateCompanyFollowersByIdUseCase(companyFollowersId, companyFollowersInfo) {
  return await companyFollowersRepo.updateById(companyFollowersId, companyFollowersInfo);
}

export default {
  createCompanyFollowersUseCase,
  getCompanyFollowerssUseCase,
  getCompanyFollowersByIdUseCase,
  updateCompanyFollowersByIdUseCase,
};
