import messageModel from "../models/message.model.js";
import paginator from "../../helper/paginator.js";

async function findAll() {
  return await messageModel.find().populate('job').lean();
}
//gets the messages that has the status as delivered and the user is the receiver
async function findUnreadMessages(userId) {
  return await messageModel.find({ receiver: userId, status: "delivered" }).populate(
    [{
      path: "job",
      populate: [
        {
          path: "company",
          populate: [{
            path: "subModel",
            populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }],
          }],
        },
        {
          path: "city",
        },
        {
          path: "province",
        },
        {
          path: "country",
        },
        {
          path: "major",
        },
        {
          path: "workType",
        },
        {
          path: "jobType",
        },

      ],
    },]
  ).lean();
}
async function findLatestMessageInChat(chatId) {
  return await messageModel.findOne({ chat: chatId }).populate(
    [{
      path: "job",
      populate: [
        {
          path: "company",
          populate: [{
            path: "subModel",
            populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }],
          }],
        },
        {
          path: "city",
        },
        {
          path: "province",
        },
        {
          path: "country",
        },
        {
          path: "major",
        },
        {
          path: "workType",
        },
        {
          path: "jobType",
        },

      ],
    },]).sort("-createdAt").lean();
}
async function findByChatId(chatId, paginationQuery) {
  const query = {
    chat: chatId,
  };
  const queryResult = await paginator(messageModel, query, paginationQuery,
    [{
      path: "job",
      populate: [
        {
          path: "company",
          populate: [{
            path: "subModel",
            populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }],
          }],
        },
        {
          path: "city",
        },
        {
          path: "province",
        },
        {
          path: "country",
        },
        {
          path: "major",
        },
        {
          path: "workType",
        },
        {
          path: "jobType",
        },

      ],
    },

    ], { createdAt: -1 });
  return queryResult;
}
async function updateByChatId(chatId) {
  return await messageModel.updateMany({ chat: chatId }, { status: "read" }, { multi: true }).lean();
}
async function findById(messageId) {
  return await messageModel.findById(messageId).populate(
    [{
      path: "job",
      populate: [
        {
          path: "company",
          populate: [{
            path: "subModel",
            populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }],
          }],
        },
        // Populate additional fields from the job object
        {
          path: "city",
        },
        {
          path: "province",
        },
        {
          path: "country",
        },
        {
          path: "major",
        },
        {
          path: "workType",
        },
        {
          path: "jobType",
        },
      ],
    }]
  ).lean();
}
async function updateById(messageId, updatedMessageInfo) {
  return await messageModel.findByIdAndUpdate(messageId, updatedMessageInfo, { new: true, runValidators: true }).lean();
}
async function insert(messageInfo) {
  const newMessage = new messageModel(messageInfo);
  await newMessage.save();
  return newMessage;
}
async function removeMessageById(MessageId) {
  await messageModel.deleteOne({ _id: MessageId });
  return;
}

async function deleteAllMessagesByChatIds(chatIds) {
  await messageModel.deleteMany({ chat: { $in: chatIds } });
  return;
}
export default {
  findAll,
  insert,
  findByChatId,
  findById,
  updateById,
  removeMessageById,
  updateByChatId,
  findLatestMessageInChat,
  findUnreadMessages,
  deleteAllMessagesByChatIds
};
