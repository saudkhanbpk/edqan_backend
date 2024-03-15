import { notificationTypeRepo } from "../data-access-layer/index.js";
import { makeNotificationType } from "../entities/index.js";
import userUseCase from "./user.use-case.js";

async function createNotificationTypeUseCase(notificationTypeInfo) {
  const newNotificationType = await makeNotificationType(notificationTypeInfo);
  await notificationTypeRepo.insert(newNotificationType);
  await userUseCase.adjustUserNotificationsAccordingToNotificationTypesUseCase();
  return;
}

async function getNotificationTypeByIdUseCase(notificationTypeId) {
  return await notificationTypeRepo.findById(notificationTypeId);
}

async function getNotificationTypesUseCase(notificationTypeInfo) {
  return await notificationTypeRepo.findAll();
}

async function getNotificationTypeByModelUseCase(userModel) {
  return await notificationTypeRepo.findByModel(userModel);
}

async function updateNotificationTypeByIdUseCase(notificationTypeId, notificationTypeInfo) {
  return await notificationTypeRepo.updateById(notificationTypeId, notificationTypeInfo);
}

async function deleteNotificationTypeByIdUseCase(notificationTypeId) {
  await notificationTypeRepo.deleteNotificationTypeById(notificationTypeId);
  await userUseCase.adjustUserNotificationsAccordingToNotificationTypesUseCase();
  return;
}

export default {
  createNotificationTypeUseCase,
  getNotificationTypeByIdUseCase,
  getNotificationTypesUseCase,
  getNotificationTypeByModelUseCase,
  updateNotificationTypeByIdUseCase,
  deleteNotificationTypeByIdUseCase,
};
