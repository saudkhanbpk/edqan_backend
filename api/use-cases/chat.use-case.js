import { chatRepo, studentRepo, mentorRepo, messageRepo } from "../data-access-layer/index.js";
import userTypesModelNamesEnum from "../types/userTypesModelNames.enum.js";
import { makeChat } from "../entities/index.js";

async function createChatUseCase(chatInfo) {
  const newChat = await makeChat(chatInfo);
  return await chatRepo.insert(newChat);
}

async function getChatsByUserIdUseCase(userId) {
  const chats = await chatRepo.findByUserId(userId);
  for (const chat of chats) {
    const userObj = chat.user1 || chat.user2;
    chat.otherUser = {};
    chat.otherUser._id = userObj?._id;
    if (userObj?.model === userTypesModelNamesEnum.MENTOR || userObj?.model === userTypesModelNamesEnum.STUDENT)
      chat.otherUser.name = userObj.subModel.firstName + " " + userObj?.subModel.lastName;
    if (userObj?.model === userTypesModelNamesEnum.COMPANY || userObj?.model === userTypesModelNamesEnum.INSTITUTION)
      chat.otherUser.name = userObj?.subModel.name;
    chat.otherUser.profileImage = userObj?.profileImage ?? userObj?.subModel?.logo;
    chat.otherUser.model = userObj?.model;

    const lastMessage = await messageRepo.findLatestMessageInChat(chat._id);

    if (String(lastMessage.sender) === userId) chat.sentByMe = true;

    chat.LastMessage = lastMessage.message;
    chat.LastMessageDate = lastMessage.createdAt;
    chat.LastMessageStatus = lastMessage.status;

    delete chat.user1;
    delete chat.user2;
  }
  return chats;
}

async function getChatByIdUseCase(chatId, userId) {
  return await chatRepo.findById(chatId, userId);
}

async function updateChatByIdUseCase(chatId, chatInfo) {
  return await chatRepo.updateById(chatId, chatInfo);
}

export default {
  createChatUseCase,
  getChatsByUserIdUseCase,
  getChatByIdUseCase,
  updateChatByIdUseCase,
};
