import { successfulResponse } from "../helper/response-formatter.js";
import { mentorUseCase } from "../use-cases/index.js";

async function getMentorsConnection(httpRequest) {
  return successfulResponse(await mentorUseCase.getMentorsConnectionUseCase(httpRequest.user._id, httpRequest.query, httpRequest.paginationQuery));
}
async function getMentors(httpRequest) {
  // if(httpRequest.user.model=='Student') httpRequest.query.approved=true;
  return successfulResponse(await mentorUseCase.getMentorsUseCase(httpRequest.query, httpRequest.paginationQuery));
}
async function addAvailabilityMentorById(httpRequest) {
  return successfulResponse(await mentorUseCase.addAvailabilityMentorByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function findMentorshipSessionByMentor(httpRequest) {
  const mentorshipSessions = await mentorUseCase.findMentorshipSessionByMentorAndDateUseCase(httpRequest.params._id, httpRequest.query);
  return successfulResponse(mentorshipSessions);
}
async function findAllUsersWhoViewedAProfile(httpRequest) {
  const users = await mentorUseCase.findAllUsersWhoViewedAProfileUseCase(httpRequest.params._id, httpRequest.query);
  return successfulResponse(users);
}
async function findByMentorOngoingSessions(httpRequest) {
  const mentorshipSessions = await mentorUseCase.findByMentorOngoingSessionsUseCase(httpRequest.params._id, httpRequest.query);
  return successfulResponse(mentorshipSessions);
}
async function findByMentorSessions(httpRequest) {
  const mentorshipSessions = await mentorUseCase.findByMentorSessionsUseCase(httpRequest.params._id, httpRequest.query);
  return successfulResponse(mentorshipSessions);
}

async function removeDateFromMentorAvailability(httpRequest) {
  return successfulResponse(await mentorUseCase.removeDateFromMentorAvailability(httpRequest.params.user, httpRequest.query.dateIndex));
}
export default {
  addAvailabilityMentorById,
  getMentorsConnection,
  findMentorshipSessionByMentor,
  findAllUsersWhoViewedAProfile,
  getMentors,
  findByMentorOngoingSessions,
  findByMentorSessions,
  removeDateFromMentorAvailability,
};
