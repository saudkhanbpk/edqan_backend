import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { fileUploadService, fileMimeType } from "../helper/fileUploadService.js";
import { messageUseCase } from "../use-cases/index.js";

async function createMessage(httpRequest) {
  let message;

  message = await fileUploadService(httpRequest.originalReqObject, "message-attachments", ["attachment"], true, fileMimeType.IMAGE, true);
  const newMessage = await messageUseCase.createMessageUseCase(message, httpRequest.user._id);

  return successfullyCreatedResponse(newMessage);
}
async function getMessagesByChatId(httpRequest) {
  return successfulResponse(await messageUseCase.getMessagesByChatIdUseCase(httpRequest.params.chatId,httpRequest.user?._id,httpRequest.paginationQuery));
}
async function getMessageById(httpRequest) {
  return successfulResponse(await messageUseCase.getMessageByIdUseCase(httpRequest.params._id));
}
async function getUnreadMessagesCountByUser(httpRequest) {
  return successfulResponse(await messageUseCase.getUnreadMessagesCountByUserUseCase(httpRequest.user._id));
}
async function updateMessageById(httpRequest) {
  return successfulResponse(await messageUseCase.updateMessageByIdUseCase(httpRequest.params._id, httpRequest.body));
}

export default { createMessage, getMessageById, getMessagesByChatId, updateMessageById, getUnreadMessagesCountByUser };
