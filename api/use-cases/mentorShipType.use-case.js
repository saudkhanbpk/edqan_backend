import { mentorShipTypeRepo } from "../data-access-layer/index.js";
import { makeMentorShipType } from "../entities/index.js";

async function createMentorShipTypeUseCase(mentorShipTypeInfo) {
  const newMentorShipType = await makeMentorShipType(mentorShipTypeInfo);
  return await mentorShipTypeRepo.insert(newMentorShipType);
}

async function getMentorShipTypesUseCase(mentorShipTypeInfo) {
  return await mentorShipTypeRepo.findAll();
}

async function getMentorShipTypeByIdUseCase(mentorShipTypeId) {
  return await mentorShipTypeRepo.findById(mentorShipTypeId);
}

async function removeMentorShipTypeByIdUseCase(mentorShipTypeId) {
  return await mentorShipTypeRepo.removeMentorShipTypeById(mentorShipTypeId);
}

async function updateMentorShipTypeByIdUseCase(mentorShipTypeId, mentorShipTypeInfo) {
  return await mentorShipTypeRepo.updateById(mentorShipTypeId, mentorShipTypeInfo);
}

export default {
  createMentorShipTypeUseCase,
  getMentorShipTypesUseCase,
  getMentorShipTypeByIdUseCase,
  removeMentorShipTypeByIdUseCase,
  updateMentorShipTypeByIdUseCase,
};
