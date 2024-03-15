import { educationLevelGroupRepo } from "../data-access-layer/index.js";
import { makeEducationLevelGroup } from "../entities/index.js";

async function createEducationLevelGroupUseCase(educationLevelGroupInfo) {
  const newEducationLevelGroup = await makeEducationLevelGroup(educationLevelGroupInfo);
  return await educationLevelGroupRepo.insert(newEducationLevelGroup);
}

async function getEducationLevelGroupsUseCase() {
  return await educationLevelGroupRepo.findAll();
}

async function getEducationLevelGroupByEducationLvlIdUseCase(educationLevelGroupId) {
  return await educationLevelGroupRepo.findByEducationLevel(educationLevelGroupId);
}

async function getEducationLevelGroupByIdUseCase(educationLevelGroupId) {
  return await educationLevelGroupRepo.findById(educationLevelGroupId);
}

async function getEducationLevelGroupByNameUseCase(educationLevelGroupName) {
  return await educationLevelGroupRepo.findByName(educationLevelGroupName);
}

async function updateEducationLevelGroupByIdUseCase(educationLevelGroupId, educationLevelGroupInfo) {
  return await educationLevelGroupRepo.updateById(educationLevelGroupId, educationLevelGroupInfo);
}

export default {
  createEducationLevelGroupUseCase,
  getEducationLevelGroupsUseCase,
  getEducationLevelGroupByIdUseCase,
  updateEducationLevelGroupByIdUseCase,
  getEducationLevelGroupByNameUseCase,
  getEducationLevelGroupByEducationLvlIdUseCase,
};
