import { fileUploadService, fileMimeType } from "../helper/fileUploadService.js";
import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { userUseCase } from "../use-cases/index.js";
import jwt from "../helper/jwt.js";
import { adminRepo, userRepo } from "../data-access-layer/index.js";
import { adminRoles } from "../security/accessControl.js";

async function generateAndSendUserVerification(httpRequest) {
  await userUseCase.generateAndSendUserVerificationUseCase(httpRequest.params._id);
  return successfulResponse();
}
async function generateAndSendUserPasswordReset(httpRequest) {
  await userUseCase.generateAndSendUserPasswordResetUseCase(httpRequest.params.userEmail);
  return successfulResponse();
}
async function resetUserPassword(httpRequest) {
  const user = await userUseCase.ResetUserPasswordUseCase(httpRequest.params._id, httpRequest.body.passwordResetToken, httpRequest.body.newPassword);
  return successfulResponse();
}
async function updatePassword(httpRequest) {
  const user = await userUseCase.updatePasswordUseCase(httpRequest.user._id, httpRequest.body);
  return successfulResponse(user);
}
async function verifyUser(httpRequest) {
  const verified = await userUseCase.verifyUserUseCase(httpRequest.params._id, httpRequest.params.verificationToken);
  const redirectUrl = process.env.APPLICATION_URL + "?verified=" + verified;

  return httpRequest.response.redirect(301, redirectUrl);
}
async function userLogin(httpRequest) {
  const newUser = await userUseCase.userLoginUseCase(httpRequest.body);
  return successfulResponse(newUser);
}
async function createUser(httpRequest) {
  let attachment = await fileUploadService(
    httpRequest.originalReqObject,
    "userAccountImages",
    ["profileImage", "logo", "banner"],
    true,
    fileMimeType.IMAGE
  );
  let isAdminUpdatingInfoNotUser = false;
  if (httpRequest.admin) isAdminUpdatingInfoNotUser = true;
  const newUser = await userUseCase.createUserUseCase(attachment, isAdminUpdatingInfoNotUser);
  return successfullyCreatedResponse(newUser);
}
async function getUsers(httpRequest) {
  // this part to be enhanced its a solution on the go because i cant put a checkAuth middle ware on this route
  if (httpRequest.token) {
    let req = httpRequest.headers;
    const token = req.headers.authorization.split(" ")[1];
    const verifiedToken = await jwt.verify(token);
    if (Object.values(adminRoles).includes(verifiedToken.role)) httpRequest.admin = await adminRepo.findById(verifiedToken._id);
    else httpRequest.user = await userRepo.findById(verifiedToken._id);
  }
  // end of enhancement

  if (httpRequest.user) httpRequest.query.approved = true;
  if (httpRequest.user?.model == "Company") httpRequest.query.accountVisibility = ["employer", "community"];
  else if (httpRequest.user?.model == "Mentor") httpRequest.query.accountVisibility = ["community"];
  return successfulResponse(await userUseCase.getUsersUseCase(httpRequest.query, httpRequest.paginationQuery, httpRequest.query.approved));
}
async function getUserById(httpRequest) {
  return successfulResponse(await userUseCase.getUserByIdUseCase(httpRequest.params._id));
}

async function getUserVersionById(httpRequest) {
  return successfulResponse(await userUseCase.getUserVersionByIdUseCase(httpRequest.params._id));
}

async function updateUserById(httpRequest) {
  if (httpRequest.body?.availabilityTime) throw new Error("availabilityTime is not allowed to be updated from update user api");
  let attachment = await fileUploadService(
    httpRequest.originalReqObject,
    "userAccountImages",
    ["profileImage", "logo", "banner", "companyMedia", "coverPhoto"],
    true,
    [fileMimeType.IMAGE],
    true
  );
  let isUserUpdatingInfoNotAdmin = false;
  if (httpRequest.user) isUserUpdatingInfoNotAdmin = true;
  return successfulResponse(await userUseCase.updateUserByIdUseCase(httpRequest.params._id, attachment, isUserUpdatingInfoNotAdmin));
}
async function updateUserNotificationPreferences(httpRequest) {
  return successfulResponse(await userUseCase.updateUserNotificationPreferencesUseCase(httpRequest.params._id, httpRequest.body));
}
async function getUserNotificationPreferences(httpRequest) {
  return successfulResponse(await userUseCase.getUserNotificationPreferencesUseCase(httpRequest.params._id));
}
async function areAllFieldsFilled(httpRequest) {
  return successfulResponse(await userUseCase.areAllFieldsFilledUseCase(httpRequest.params._id));
}
async function approveOrDeclineNewDataUpdate(httpRequest) {
  if (httpRequest.user) throw new Error("Only admin can approve or decline new data update");
  return successfulResponse(await userUseCase.approveOrDeclineNewDataUpdate(httpRequest.params._id, httpRequest.query.approved));
}
async function removeUser(httpRequest) {
  if (httpRequest.user) throw new Error("Only admin can remove user");
  return successfulResponse(await userUseCase.removeUserUseCase(httpRequest.params._id));
}

// get users with new data
async function getUsersWithNewData(httpRequest) {
  if (httpRequest.user) throw new Error("Only admin can get users with new data");
  return successfulResponse(await userUseCase.getUsersWithNewDataUseCase(httpRequest.paginationQuery));
}

export default {
  createUser,
  getUserById,
  getUsers,
  updateUserById,
  userLogin,
  updatePassword,
  getUserNotificationPreferences,
  updateUserNotificationPreferences,
  areAllFieldsFilled,
  verifyUser,
  generateAndSendUserPasswordReset,
  resetUserPassword,
  generateAndSendUserVerification,
  approveOrDeclineNewDataUpdate,
  removeUser,
  getUsersWithNewData,
  getUserVersionById,
};
