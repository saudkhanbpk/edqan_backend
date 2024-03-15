import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { adminUseCase } from "../use-cases/index.js";

async function addAdmin(httpRequest) {
  const newAdmin = await adminUseCase.addAdminUseCase(httpRequest.body);
  return successfullyCreatedResponse(newAdmin);
}
async function updatePassword(httpRequest) {
  const user = await adminUseCase.updatePasswordUseCase(httpRequest.admin._id, httpRequest.body);
  return successfulResponse(user);
}
async function deleteAdmin(httpRequest) {
  const deletedAdmin = await adminUseCase.deleteAdminUseCase(httpRequest.params._id);
  return successfulResponse(deletedAdmin);
}
async function adminLogin(httpRequest) {
  const admin = await adminUseCase.adminLoginUseCase(httpRequest.body);
  return successfulResponse(admin);
}
async function getAdmins() {
  const orders = await adminUseCase.getAdminsUseCase();
  return successfulResponse(orders);
}
async function getAdminById(httpRequest) {
  const orders = await adminUseCase.getAdminByIdUseCase(httpRequest.params);
  return successfulResponse(orders);
}
async function updateAdmin(httpRequest) {
  const updatedAdmin = await adminUseCase.updateAdminUseCase(httpRequest.params, httpRequest.body);
  return successfulResponse(updatedAdmin);
}
async function getNumberOfUsersByType(httpRequest) {
  const numberOfUsers = await adminUseCase.getNumberOfUsersByTypeUseCase(httpRequest.params.model);
  return successfulResponse(numberOfUsers);
}
async function getNumberOfUsersWhoCompletedProfile(httpRequest) {
  const numberOfUsers = await adminUseCase.getNumberOfUsersWhoCompletedProfile();
  return successfulResponse(numberOfUsers);
}
async function getNumberOfUsersAddedInTimePeriod(httpRequest) {
  const numberOfUsers = await adminUseCase.getNumberOfUsersAddedInTimePeriod(httpRequest.query);
  return successfulResponse(numberOfUsers);
}
async function getNumberOfDistinctUsersWhoAppliedToJobsInTimeRange(httpRequest) {
  const numberOfUsers = await adminUseCase.getNumberOfDistinctUsersWhoAppliedToJobsInTimeRange(httpRequest.query);
  return successfulResponse(numberOfUsers);
}
async function getNumberOfDistinctUsersWhereStatusIsHiredInTimeRange(httpRequest) {
  const numberOfUsers = await adminUseCase.getNumberOfDistinctUsersWhereStatusIsHiredInTimeRange(httpRequest.query);
  return successfulResponse(numberOfUsers);
}
async function getNumberOfStudentsWhoFollowedCompany(httpRequest) {
  const numberOfUsers = await adminUseCase.getNumberOfStudentsWhoFollowedCompany(httpRequest.params._id);
  return successfulResponse(numberOfUsers);
}
async function getNumberOfStudentsWhoFollowedInstitution(httpRequest) {
  const numberOfUsers = await adminUseCase.getNumberOfStudentsWhoFollowedInstitution(httpRequest.params._id);
  return successfulResponse(numberOfUsers);
}
async function findMentorshipSessionByMentor(httpRequest) {
  const mentorshipSessions = await adminUseCase.findMentorshipSessionByMentorUseCase();

  return successfulResponse(mentorshipSessions);
}
async function generateAndSendAdminPasswordReset(httpRequest) {
  const admin = await adminUseCase.generateAndSendAdminPasswordResetUseCase(httpRequest.params.userEmail);
  return successfulResponse(admin);
}
async function resetUserPassword(httpRequest) {
  const user = await adminUseCase.ResetUserPasswordUseCase(httpRequest.params._id, httpRequest.body.passwordResetToken, httpRequest.body.newPassword);
  return successfulResponse();
}

export default {
  addAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  adminLogin,
  deleteAdmin,
  getNumberOfUsersByType,
  getNumberOfUsersWhoCompletedProfile,
  getNumberOfUsersAddedInTimePeriod,
  getNumberOfDistinctUsersWhoAppliedToJobsInTimeRange,
  getNumberOfDistinctUsersWhereStatusIsHiredInTimeRange,
  getNumberOfStudentsWhoFollowedCompany,
  getNumberOfStudentsWhoFollowedInstitution,
  findMentorshipSessionByMentor,
  generateAndSendAdminPasswordReset,
  resetUserPassword,
  updatePassword,
};
