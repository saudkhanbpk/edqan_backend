import { meetingDurationRepo } from "../data-access-layer/index.js";
import { makeMeetingDuration } from "../entities/index.js";

async function createMeetingDurationUseCase(meetingDurationInfo) {
  const alreadyMeetingDuration = await meetingDurationRepo.findAll();
  if (alreadyMeetingDuration.length > 0) throw new Error("Meeting duration already exists");
  const newMeetingDuration = await makeMeetingDuration(meetingDurationInfo);
  return await meetingDurationRepo.insert(newMeetingDuration);
}

async function getMeetingDurationsUseCase(meetingDurationInfo) {
  return await meetingDurationRepo.findAll();
}

async function getMeetingDurationByIdUseCase(meetingDurationId) {
  return await meetingDurationRepo.findById(meetingDurationId);
}

async function updateMeetingDurationByIdUseCase(meetingDurationId, meetingDurationInfo) {
  meetingDurationInfo.durationMinutes=meetingDurationInfo.duration
  delete meetingDurationInfo.duration;
  return await meetingDurationRepo.updateById(meetingDurationId, meetingDurationInfo);
}

export default {
  createMeetingDurationUseCase,
  getMeetingDurationsUseCase,
  getMeetingDurationByIdUseCase,
  updateMeetingDurationByIdUseCase,
};
