import { fileUploadService, fileMimeType } from "../helper/fileUploadService.js";
import { successfullyCreatedResponse, successfulResponse, successfullyDeletedResponse } from "../helper/response-formatter.js";
import { userAttachmentUseCase } from "../use-cases/index.js";

async function createUserAttachment(httpRequest) {
  let attachment = await fileUploadService(httpRequest.originalReqObject, "attachments", ["attachment"], true, fileMimeType.PDF);
  attachment.user = httpRequest.params.userId;
  const newUserAttachment = await userAttachmentUseCase.createUserAttachmentUseCase(attachment);
  return successfullyCreatedResponse(newUserAttachment);
}
async function getUserAttachments(httpRequest) {
  return successfulResponse(
    await userAttachmentUseCase.getUserAttachmentsUseCase(
      httpRequest.params.userId,
      httpRequest.query.status,
      httpRequest.query.visible,
      httpRequest.query.attachmentType
    )
  );
}
async function getUserAttachmentById(httpRequest) {
  return successfulResponse(await userAttachmentUseCase.getUserAttachmentByIdUseCase(httpRequest.params._id));
}
async function updateUserAttachmentById(httpRequest) {
  if (httpRequest.body.status && httpRequest.user) throw new Error("You are not authorized to perform this action");

  return successfulResponse(await userAttachmentUseCase.updateUserAttachmentByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function removeUserAttachmentById(httpRequest) {
  return successfullyDeletedResponse(await userAttachmentUseCase.removeUserAttachmentByIdUseCase(httpRequest.params._id));
}
async function getAllFilteredUserAttachments(httpRequest) {
  return successfulResponse(
    await userAttachmentUseCase.getAllFilteredUserAttachmentsUseCase(
      httpRequest.query.status,
      httpRequest.query.visible,
      httpRequest.query.attachmentType
    )
  );
}

export default {
  createUserAttachment,
  getUserAttachmentById,
  getUserAttachments,
  updateUserAttachmentById,
  removeUserAttachmentById,
  getAllFilteredUserAttachments,
};
