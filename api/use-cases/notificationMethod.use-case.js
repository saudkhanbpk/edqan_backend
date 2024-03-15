import { notificationMethodRepo } from "../data-access-layer/index.js";
import { makeNotificationMethod } from "../entities/index.js";
import userUseCase from "./user.use-case.js";

async function createNotificationMethodUseCase(notificationMethodInfo) {
  const newNotificationMethod = await makeNotificationMethod(notificationMethodInfo);
  await notificationMethodRepo.insert(newNotificationMethod);
  await userUseCase.adjustUserNotificationsAccordingToNotificationTypesUseCase();
  return;
}

async function getNotificationMethodsUseCase(notificationMethodInfo) {
  return await notificationMethodRepo.findAll();
}

async function getNotificationMethodByIdUseCase(notificationMethodId) {
  return await notificationMethodRepo.findById(notificationMethodId);
}

async function updateNotificationMethodByIdUseCase(notificationMethodId, notificationMethodInfo) {
  return await notificationMethodRepo.updateById(notificationMethodId, notificationMethodInfo);
}

async function deleteNotificationMethodByIdUseCase(notificationMethodId) {
  await notificationMethodRepo.deleteNotificationMethodById(notificationMethodId);
  await userUseCase.adjustUserNotificationsAccordingToNotificationTypesUseCase();
  return;
}

export default {
  createNotificationMethodUseCase,
  getNotificationMethodsUseCase,
  getNotificationMethodByIdUseCase,
  updateNotificationMethodByIdUseCase,
  deleteNotificationMethodByIdUseCase,
};
