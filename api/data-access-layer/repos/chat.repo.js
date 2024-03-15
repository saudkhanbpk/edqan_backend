import chatModel from "../models/chat.model.js";
import messageRepo from "./message.repo.js";

async function findAll(userId) {
  return await chatModel.find().lean();
}
async function findByUserId(userId) {
  return await chatModel
    .find({
      $or: [{ user1: userId }, { user2: userId }],
    })
    .populate([
      {
        path: "user1",
        populate: { path: "subModel" },
        match: { _id: { $ne: userId } }, // Exclude user1 with matching _id not equal to userId
      },
      {
        path: "user2",
        populate: { path: "subModel" },
        match: { _id: { $ne: userId } }, // Exclude user2 with matching _id not equal to userId
      },
    ])
    .sort("-updatedAt")
    .lean();
}
async function findOne(query) {
  return await chatModel.findOne(query).lean();
}
async function findById(chatId, userId) {
  let x = await chatModel.findById(chatId);
  if (x.user1.equals(userId)) await x.populate("user1");
  if (x.user2.equals(userId)) await x.populate("user2");
  return x;
}
async function updateById(chatId, updatedChatInfo) {
  return await chatModel
    .findByIdAndUpdate(chatId, updatedChatInfo, {
      new: true,
      runValidators: true,
    })
    .lean();
}
async function insert(chatInfo) {
  const newChat = new chatModel(chatInfo);
  await newChat.save();
  return newChat;
}
async function removeChatById(ChatId) {
  // let messages = await messageModel.find({ chat: ChatId }).lean();
  // if (messages.length > 0) {
  //   //delete messages
  //   await messageModel.deleteMany({ chat: ChatId });
  // }
  await chatModel.deleteOne({ _id: ChatId });
  return;
}

async function deleteAllChatsByUserId(userId) {
  //get all chats with user
  let chats=await chatModel.find({ $or: [{ user1: userId }, { user2: userId }] }).select("_id -v");
  //delete all  messages 
  await messageRepo.deleteAllMessagesByChatIds(chats);
  await chatModel.deleteMany({ $or: [{ user1: userId }, { user2: userId }] });
}
export default { findAll, findOne, insert, findById, updateById, removeChatById, findByUserId ,deleteAllChatsByUserId};
