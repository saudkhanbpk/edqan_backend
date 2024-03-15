import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { mentorShipTypeUseCase } from "../use-cases/index.js";

async function createMentorShipType(httpRequest) {
  const newMentorShipType = await mentorShipTypeUseCase.createMentorShipTypeUseCase(httpRequest.body);
  return successfullyCreatedResponse(newMentorShipType);
}
async function getMentorShipTypes() {
  return successfulResponse(await mentorShipTypeUseCase.getMentorShipTypesUseCase());
}
async function getMentorShipTypeById(httpRequest) {
  return successfulResponse(await mentorShipTypeUseCase.getMentorShipTypeByIdUseCase(httpRequest.params._id));
}
async function updateMentorShipTypeById(httpRequest) {
  return successfulResponse(await mentorShipTypeUseCase.updateMentorShipTypeByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function removeMentorShipTypeById(httpRequest) {
  return successfulResponse(await mentorShipTypeUseCase.removeMentorShipTypeByIdUseCase(httpRequest.params._id, httpRequest.body));
}

export default { createMentorShipType, getMentorShipTypeById, getMentorShipTypes, updateMentorShipTypeById, removeMentorShipTypeById };
