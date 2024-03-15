import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { mentorShipGuideLineUseCase } from "../use-cases/index.js";

async function createMentorShipGuideLine(httpRequest) {
  const newMentorShipGuideLine = await mentorShipGuideLineUseCase.createMentorShipGuideLineUseCase(httpRequest.body);
  return successfullyCreatedResponse(newMentorShipGuideLine);
}
async function getMentorShipGuideLines() {
  return successfulResponse(await mentorShipGuideLineUseCase.getMentorShipGuideLinesUseCase());
}
async function getMentorShipGuideLineById(httpRequest) {
  return successfulResponse(await mentorShipGuideLineUseCase.getMentorShipGuideLineByIdUseCase(httpRequest.params._id));
}
async function updateMentorShipGuideLineById(httpRequest) {
  return successfulResponse(await mentorShipGuideLineUseCase.updateMentorShipGuideLineByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function removeMentorShipGuideLineById(httpRequest) {
  return successfulResponse(await mentorShipGuideLineUseCase.removeMentorShipGuideLineByIdUseCase(httpRequest.params._id));
}

export default {
  createMentorShipGuideLine,
  getMentorShipGuideLineById,
  getMentorShipGuideLines,
  updateMentorShipGuideLineById,
  removeMentorShipGuideLineById,
};
