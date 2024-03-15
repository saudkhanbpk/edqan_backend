import { messageRepo, chatRepo, userRepo } from "../data-access-layer/index.js";
import { makeMessage } from "../entities/index.js";
import userNotificationsUseCase from "./userNotifications.use-case.js";
import notificationTypeEnum from "../types/notificationType.enum.js";
import { MessageReceived } from "../notificationData/notificationData.js";

async function createMessageUseCase(messageInfo, sendingUser) {
  // to make sure to not send a message to yourself
  if (messageInfo.receiver == sendingUser) throw new Error(`can't send a message to yourself`);

  //checks if the chat already exists by using the users id, to make sure that the chat id is not redundant for the 2 users (to be checked later)
  let existingChat = await chatRepo.findOne({
    user1: { $in: [sendingUser, messageInfo.receiver] },
    user2: { $in: [sendingUser, messageInfo.receiver] },
  });

  // creating a new chat instance
  if (!existingChat) {
    existingChat = await chatRepo.insert({
      user1: sendingUser,
      user2: messageInfo.receiver,
    });
  }

  //setting the sender as the one who sends the message
  messageInfo.sender = sendingUser;
  //setting the chat as the queried chat
  messageInfo.chat = existingChat._id;
  // check if messageInfo.message contains url console log it
  if (messageInfo.message.includes("http") || messageInfo.message.includes("https")) {
    const regex = /job-details\/([a-zA-Z0-9]+)/g;
    let match;
    let jobIds = [];

    while ((match = regex.exec(messageInfo.message)) !== null) {
      if (match[1]) {
        jobIds.push(match[1]);
      }
    }

    if (jobIds.length > 0) {
      messageInfo.job = jobIds;
    }
  }

  const newMessage = await makeMessage(messageInfo, true);

  //creating a message instance
  await messageRepo.insert(newMessage);

  if (existingChat) {
    await chatRepo.updateById(existingChat._id, { updatedAt: new Date() });
  }
  // getting sender name
  let senderName = await userRepo.findById(newMessage.sender).then((user) => {
    if (user.subModel.name) return user.subModel.name;
    else return user.subModel.firstName + " " + user.subModel.lastName;
  });
  // getting receiver name
  let receiverName = await userRepo.findById(newMessage.receiver).then((user) => {
    if (user.subModel.name) return user.subModel.name;
    else return user.subModel.firstName + " " + user.subModel.lastName;
  });
  await userNotificationsUseCase.createUserNotificationsUseCase(
    notificationTypeEnum.MESSAGE_RECEIVED,
    newMessage.receiver,
    new MessageReceived(receiverName, senderName,`${process.env.APPLICATION_URL}inbox?chatId=${newMessage.chat}`
    )
  );
}

async function getMessagesByChatIdUseCase(chatId,userId,paginationQuery) {
  // find latest message and see if the reciver equals the reciver of the chat so update it 
  let message = await messageRepo.findLatestMessageInChat(chatId);
  if(message.status=="delivered"){
    if (message.receiver.toString() === userId.toString()) {
      await messageRepo.updateByChatId(chatId);
    }
  }

  return await messageRepo.findByChatId(chatId, paginationQuery);
}

async function getUnreadMessagesCountByUserUseCase(userId) {
  let messages = await messageRepo.findUnreadMessages(userId);
  return {
    message: messages.length,
  };
}

async function getMessageByIdUseCase(messageId) {
  return await messageRepo.findById(messageId);
}

async function updateMessageByIdUseCase(messageId, messageInfo) {
  return await messageRepo.updateById(messageId, messageInfo);
}

export default {
  createMessageUseCase,
  getMessagesByChatIdUseCase,
  getUnreadMessagesCountByUserUseCase,
  getMessageByIdUseCase,
  updateMessageByIdUseCase,
};
