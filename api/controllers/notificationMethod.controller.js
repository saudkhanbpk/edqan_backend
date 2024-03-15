import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { notificationMethodUseCase } from "../use-cases/index.js";

async function createNotificationMethod(httpRequest) {
  const newNotificationMethod = await notificationMethodUseCase.createNotificationMethodUseCase(httpRequest.body);
  return successfullyCreatedResponse(newNotificationMethod);
}
async function getNotificationMethods() {
  return successfulResponse(await notificationMethodUseCase.getNotificationMethodsUseCase());
}
async function getNotificationMethodById(httpRequest) {
  return successfulResponse(await notificationMethodUseCase.getNotificationMethodByIdUseCase(httpRequest.params._id));
}
async function updateNotificationMethodById(httpRequest) {
  return successfulResponse(await notificationMethodUseCase.updateNotificationMethodByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function deleteNotificationMethodById(httpRequest) {
  return successfulResponse(await notificationMethodUseCase.deleteNotificationMethodByIdUseCase(httpRequest.params._id));
}

export default {
  createNotificationMethod,
  getNotificationMethodById,
  getNotificationMethods,
  updateNotificationMethodById,
  deleteNotificationMethodById,
};
