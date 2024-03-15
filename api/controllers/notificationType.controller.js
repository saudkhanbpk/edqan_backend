import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { notificationTypeUseCase } from "../use-cases/index.js";

async function createNotificationType(httpRequest) {
  const newNotificationType = await notificationTypeUseCase.createNotificationTypeUseCase(httpRequest.body);
  return successfullyCreatedResponse(newNotificationType);
}
async function getNotificationTypes() {
  return successfulResponse(await notificationTypeUseCase.getNotificationTypesUseCase());
}
async function getNotificationTypeById(httpRequest) {
  return successfulResponse(await notificationTypeUseCase.getNotificationTypeByIdUseCase(httpRequest.params._id));
}
async function getNotificationTypeByModel(httpRequest) {
  return successfulResponse(await notificationTypeUseCase.getNotificationTypeByModelUseCase(httpRequest.params.userModel));
}
async function updateNotificationTypeById(httpRequest) {
  return successfulResponse(await notificationTypeUseCase.updateNotificationTypeByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function deleteNotificationTypeById(httpRequest) {
  return successfulResponse(await notificationTypeUseCase.deleteNotificationTypeByIdUseCase(httpRequest.params._id));
}

export default {
  createNotificationType,
  getNotificationTypeById,
  getNotificationTypes,
  updateNotificationTypeById,
  deleteNotificationTypeById,
  getNotificationTypeByModel,
};
