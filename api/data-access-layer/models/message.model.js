import mongoose from 'mongoose';
import { trimAndRemoveSpaces } from '../../helper/helper.js';
import messageStatusEnum from '../../types/messageStatus.enum.js';
import idvalidator from "mongoose-id-validator";


const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "message is required"],
    set: trimAndRemoveSpaces,
  },
  attachment: {
    type: [String],
    // set: trimAndRemoveSpaces,
    default: undefined
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: [true, "chat is required"]
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "sender is required"],
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "receiver is required"],
  },
  job: {
    type:[ mongoose.Schema.Types.ObjectId],
    ref: "Job",
  },
  status: {
    type: String,
    enum: {
      values: Object.values(messageStatusEnum),
      message: "enter a valid status",
    },
    default: messageStatusEnum.DELIVERED
  },
}, {
  timestamps: true
});

// messageSchema.plugin(idvalidator);
export default mongoose.model("Message", messageSchema);