import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { meetingUseCase } from "../use-cases/index.js";

async function createMeeting(httpRequest) {
  const newMeeting = await meetingUseCase.createMeetingUseCase(httpRequest.query.userId, httpRequest.body);
  return successfullyCreatedResponse(newMeeting);
}
async function getMeetings(httpRequest) {
  if (httpRequest.user?.model == "Mentor"|| httpRequest.user?.model == "Student") httpRequest.query.approved = "approved";
  if(httpRequest.user?.model == "Student") httpRequest.query.status = "ongoing";
  return successfulResponse(await meetingUseCase.getMeetingsUseCase(httpRequest.query.userId, httpRequest.query, httpRequest.paginationQuery));
}
async function getMeetingById(httpRequest) {
  return successfulResponse(await meetingUseCase.getMeetingByIdUseCase(httpRequest.params._id));
}
async function updateMeetingById(httpRequest) {
  if (httpRequest.body.mentorShipSession.approved) {
    if (httpRequest.user) throw new Error("You are not authorized to approve this meeting");

    if (httpRequest.body.mentorShipSession.approved == "declined") httpRequest.body.mentorShipSession.status = "declined";
  }
  return successfulResponse(await meetingUseCase.updateMeetingByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function updateMeetingMentorRating(httpRequest) {
  return successfulResponse(await meetingUseCase.updateMeetingByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function updateMeetingMenteeRating(httpRequest) {
  return successfulResponse(await meetingUseCase.updateMeetingByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function updateMeetingStatus(httpRequest) {
  if (httpRequest.user?.model == "Student") {
    if (httpRequest.body.status !== "declined") throw new Error("as a student you can only decline a meeting");
  }
  return successfulResponse(await meetingUseCase.updateMeetingStatusUseCase(httpRequest.params._id, httpRequest.body, httpRequest.user._id));
}
async function getAllSessionCompleted() {
  return successfulResponse(await meetingUseCase.getAllSessionCompletedUseCase());
}
async function getMeetingsPending(httpRequest) {
  return successfulResponse(await meetingUseCase.getMeetingsPendingUseCase(httpRequest.user._id, httpRequest.query));
}

async function findAllMeetingsCalendar(httpRequest) {
  return successfulResponse(await meetingUseCase.findAllMeetingsCalendarUseCase(httpRequest.user._id, httpRequest.paginationQuery));
}

export default {
  createMeeting,
  getMeetingById,
  getMeetings,
  updateMeetingById,
  getMeetingsPending,
  updateMeetingMenteeRating,
  updateMeetingMentorRating,
  updateMeetingStatus,
  getAllSessionCompleted,
  findAllMeetingsCalendar
  
};
