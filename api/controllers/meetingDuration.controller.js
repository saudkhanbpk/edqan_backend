import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { meetingDurationUseCase } from "../use-cases/index.js";

async function createMeetingDuration(httpRequest) {
  const newMeetingDuration = await meetingDurationUseCase.createMeetingDurationUseCase(httpRequest.body);
  return successfullyCreatedResponse(newMeetingDuration);
}
async function getMeetingDurations() {
  return successfulResponse(await meetingDurationUseCase.getMeetingDurationsUseCase());
}
async function getMeetingDurationById(httpRequest) {
  return successfulResponse(await meetingDurationUseCase.getMeetingDurationByIdUseCase(httpRequest.params._id));
}
async function updateMeetingDurationById(httpRequest) {
  return successfulResponse(await meetingDurationUseCase.updateMeetingDurationByIdUseCase(httpRequest.params._id, httpRequest.body));
}

export default { createMeetingDuration, getMeetingDurationById, getMeetingDurations, updateMeetingDurationById };
