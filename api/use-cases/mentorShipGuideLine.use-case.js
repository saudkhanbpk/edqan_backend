import { mentorShipGuideLineRepo } from "../data-access-layer/index.js";
import { makeMentorShipGuideLine } from "../entities/index.js";

async function createMentorShipGuideLineUseCase(mentorShipGuideLineInfo) {
  const newMentorShipGuideLine = await makeMentorShipGuideLine(mentorShipGuideLineInfo);
  return await mentorShipGuideLineRepo.insert(newMentorShipGuideLine);
}

async function getMentorShipGuideLinesUseCase(mentorShipGuideLineInfo) {
  return await mentorShipGuideLineRepo.findAll();
}

async function getMentorShipGuideLineByIdUseCase(mentorShipGuideLineId) {
  return await mentorShipGuideLineRepo.findById(mentorShipGuideLineId);
}

async function updateMentorShipGuideLineByIdUseCase(mentorShipGuideLineId, mentorShipGuideLineInfo) {
  return await mentorShipGuideLineRepo.updateById(mentorShipGuideLineId, mentorShipGuideLineInfo);
}

async function removeMentorShipGuideLineByIdUseCase(mentorShipGuideLineId) {
  return await mentorShipGuideLineRepo.removeMentorShipGuideLineById(mentorShipGuideLineId);
}

export default {
  createMentorShipGuideLineUseCase,
  getMentorShipGuideLinesUseCase,
  getMentorShipGuideLineByIdUseCase,
  updateMentorShipGuideLineByIdUseCase,
  removeMentorShipGuideLineByIdUseCase,
};
