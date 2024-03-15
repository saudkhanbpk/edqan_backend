import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { chatUseCase } from "../use-cases/index.js";

async function createChat(httpRequest) {
  const newChat = await chatUseCase.createChatUseCase(httpRequest.body);
  return successfullyCreatedResponse(newChat);
}
async function getChatsByUserId(httpRequest) {
  return successfulResponse(await chatUseCase.getChatsByUserIdUseCase(httpRequest.params.userId));
}
async function getChatById(httpRequest) {
  return successfulResponse(await chatUseCase.getChatByIdUseCase(httpRequest.params._id, httpRequest.user._id));
}
async function updateChatById(httpRequest) {
  return successfulResponse(await chatUseCase.updateChatByIdUseCase(httpRequest.params._id, httpRequest.body));
}

export default { createChat, getChatById, getChatsByUserId, updateChatById };
