import mongoose from 'mongoose';
import userAttachmentTypeEnum from '../../types/userAttachmentType.enum.js';
import userAttachmentStatusEnum from '../../types/userAttachmentStatus.enum.js';
import { trimAndRemoveSpaces } from '../../helper/helper.js';

const userAttachmentSchema = new mongoose.Schema({
  name:{
    type: String
  },
  attachmentType: {
    type: String,
    enum: {
      values: Object.values(userAttachmentTypeEnum),
      message: "enter a valid type",
    },
    required: true
  },
  attachment: {
    type: String,
    required: [true, " attachment is required"],
    set: trimAndRemoveSpaces,
  },
  dateUploaded: {
    type: Date
  },
  status: {
    type: String,
    enum: {
      values: Object.values(userAttachmentStatusEnum),
      message: "enter a valid status",
    },
    required: true
  },
  visibility: {
    type: Boolean,
    required: [true, "visibility option is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
}, {
  timestamps: true
});

export default mongoose.model("UserAttachment", userAttachmentSchema);