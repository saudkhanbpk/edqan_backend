import { adminRepo, userRepo, applicationRepo, studentRepo, meetingRepo } from "../data-access-layer/index.js";
import { PasswordReset } from "../notificationData/notificationData.js";

import { comparePassword } from "../helper/password-hash.js";
import jwt from "../helper/jwt.js";
import { WrongLoginCredentialsError } from "../error/errors.js";
import { makeAdmin } from "../entities/index.js";
import sendGrid from "@sendgrid/mail";
import { verifyCaptcha } from "../helper/helper.js";
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

async function generateAndSendAdminPasswordResetUseCase(userEmail) {
  // generate user verification token
  const passwordResetToken = await jwt.signUserPasswordResetToken();
  // save it in user model
  await adminRepo.updateByEmail(userEmail, { passwordResetToken });
  // getting user
  const user = await adminRepo.findByEmail(userEmail);
  // getting user name
  const userName = user.firstName + " " + user.lastName;

  let data = new PasswordReset(userName, `${process.env.ADMIN_URL}reset-password?passwordResetToken=${passwordResetToken}&userId=${user._id}`);
  const message = {
    from: process.env.SENDGRID_SENDER_EMAIL,
    to: user.email,
    template_id: "d-6560864cadd148718f427dc556928015",
    dynamic_template_data: { ...data },
  };

  await sendGrid.send(message);
}

async function addAdminUseCase(adminInfo) {
  const admin = await makeAdmin(adminInfo);
  await adminRepo.insert(admin);
  return;
}

async function adminLoginUseCase(adminInfo) {
  // await verifyCaptcha(adminInfo.captchaValue);
  const admin = await adminRepo.findByEmail(adminInfo.email);

  if (!admin) throw new WrongLoginCredentialsError();
  if (!(await comparePassword(adminInfo.password, admin.password))) throw new WrongLoginCredentialsError();

  const token = await jwt.sign({ _id: admin._id, role: admin.role });
  return {
    token,
    admin,
  };
}

async function getAdminsUseCase() {
  return await adminRepo.findAll();
}

async function getAdminByIdUseCase(adminId) {
  return await adminRepo.findById(adminId);
}

async function updateAdminUseCase(adminId, newAdminData) {
  const existingAdmin = await adminRepo.findById(adminId);

  const admin = await adminRepo.findByEmail(newAdminData.email);
  let adminData = { ...existingAdmin, ...newAdminData, isUpdate: true };

  adminData = await makeAdmin(adminData);

  return await adminRepo.updateById(adminId, adminData);
}

async function deleteAdminUseCase(adminId) {
  return await adminRepo.deleteById(adminId);
}

async function getNumberOfUsersByTypeUseCase(modelName) {
  return await userRepo.getNumberOfUsersByType(modelName);
}

async function getNumberOfUsersWhoCompletedProfile() {
  return await userRepo.getNumberOfUsersWhoCompletedProfile();
}

async function getNumberOfUsersAddedInTimePeriod(query) {
  return await userRepo.getNumberOfUsersAddedInTimePeriod(new Date(query.startDate), new Date(query.endDate));
}

async function getNumberOfDistinctUsersWhoAppliedToJobsInTimeRange(query) {
  return await applicationRepo.getNumberOfDistinctUsersWhoAppliedToJobsInTimeRange(new Date(query.startDate), new Date(query.endDate));
}

async function getNumberOfDistinctUsersWhereStatusIsHiredInTimeRange(query) {
  return await applicationRepo.getNumberOfDistinctUsersWhereStatusIsHiredInTimeRange(new Date(query.startDate), new Date(query.endDate));
}

async function getNumberOfStudentsWhoFollowedCompany(companyId) {
  return await studentRepo.getNumberOfStudentsWhoFollowedCompany(companyId);
}

async function getNumberOfStudentsWhoFollowedInstitution(institutionId) {
  return await studentRepo.getNumberOfStudentsWhoFollowedInstitution(institutionId);
}

async function findMentorshipSessionByMentorUseCase() {
  return await meetingRepo.findMentorshipSessionByMentor();
}

async function ResetUserPasswordUseCase(userId, passwordResetToken, newPassword) {
  // get user
  const user = await adminRepo.findById(userId);
  if (!user) throw new Error("Invalid verification data");
  // throws an error if the token sent is not the right one that the user has
  if (user.passwordResetToken !== passwordResetToken) throw new Error("Invalid verification data");
  // verifies the token
  if (!(await jwt.verifyUserPasswordResetToken(passwordResetToken))) throw new Error("Invalid verification data");
  const updatedUser = await makeAdmin({
    ...user,
    password: newPassword,
    isUpdate: false,
  });
  // update user verification status
  await adminRepo.updateById(userId, {
    ...updatedUser,
    passwordResetToken: null,
  });
  // getting user name
  // const userName = user.email.split("@")[0];
  // send a message with the token, and decide which notification type to use based on user model
  // await createUserNotificationsUseCase(
  //   notificationTypeEnum.USER_CHANGED_PASSWORD,
  //   user._id,
  //   new UserChangedPassword(userName)
  // );
}

async function updatePasswordUseCase(userId, userInfo) {
  const existingUser = await adminRepo.findById(userId);
  if (!existingUser) throw new Error("Wrong User ID");
  if (!(await comparePassword(userInfo.oldPassword, existingUser.password))) throw new Error("Wrong User ID");
  existingUser.password = userInfo.newPassword;
  const user = await makeAdmin(existingUser);
  return await adminRepo.updateById(existingUser._id, user);
}

export default {
  addAdminUseCase,
  getAdminsUseCase,
  getAdminByIdUseCase,
  updateAdminUseCase,
  adminLoginUseCase,
  deleteAdminUseCase,
  getNumberOfUsersByTypeUseCase,
  getNumberOfUsersWhoCompletedProfile,
  findMentorshipSessionByMentorUseCase,
  generateAndSendAdminPasswordResetUseCase,
  updatePasswordUseCase,
  ResetUserPasswordUseCase,
  getNumberOfUsersAddedInTimePeriod,
  getNumberOfDistinctUsersWhoAppliedToJobsInTimeRange,
  getNumberOfDistinctUsersWhereStatusIsHiredInTimeRange,
  getNumberOfStudentsWhoFollowedCompany,
  getNumberOfStudentsWhoFollowedInstitution,
};
