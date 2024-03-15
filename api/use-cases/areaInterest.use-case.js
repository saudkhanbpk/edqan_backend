import { areaInterestRepo } from "../data-access-layer/index.js";
import { makeAreaInterest } from "../entities/index.js";

async function createAreaInterestUseCase(areaInterestInfo) {
  const newAreaInterest = await makeAreaInterest(areaInterestInfo);
  return await areaInterestRepo.insert(newAreaInterest);
}

async function getAreaInterestsUseCase(query) {
  return await areaInterestRepo.findAll(query);
}

async function getAreaInterestByIdUseCase(areaInterestId) {
  return await areaInterestRepo.findById(areaInterestId);
}

async function updateAreaInterestByIdUseCase(areaInterestId, areaInterestInfo) {
  return await areaInterestRepo.updateById(areaInterestId, areaInterestInfo);
}

async function removeAreaInterestByIdUseCase(areaInterestId) {
  return await areaInterestRepo.removeAreaInterestById(areaInterestId);
}

export default {
  createAreaInterestUseCase,
  getAreaInterestsUseCase,
  getAreaInterestByIdUseCase,
  updateAreaInterestByIdUseCase,
  removeAreaInterestByIdUseCase,
};
