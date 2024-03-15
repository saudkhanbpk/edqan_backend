import mongoose from 'mongoose';
import notificationTypeEnum from '../../types/notificationType.enum.js';
import userTypesModelNamesEnum from '../../types/userTypesModelNames.enum.js';
import notificationTypeClassEnum from '../../types/notificationTypeClass.enum.js';

const notificationTypeSchema = new mongoose.Schema({
  // the kind is what we will use to identify the notification type using the notificationTypeEnum
  kind: {
    type: Number,
    index: true,
    unique: true,
    required: [true, " notification type is required"],
    enum: {
      values: Object.values(notificationTypeEnum),
      message: "enter a valid notification type",
    },
    // validator: async (value) => Object.values(notificationTypeEnum).includes(value),
    // message: 'enter a notification type kind'
  },
  name: {
    type: String,
    required: [true, "notification Type is required"],
  },
  message: {
    type: String
  },
  // the class is what identifies the notification type as internal, external or both
  class: {
    type: Number,
    enum: {
      values: Object.values(notificationTypeClassEnum),
      message: "enter a valid notification type class",
    },
    default: notificationTypeClassEnum.BOTH,
  },
  isMandatory: {
    type: Boolean,
    required: [true, "isMandatory is required"],
    default: false
  },
  models: {
    type: [String],
    default: undefined,
    validate: {
      validator: async (val) => {
        const models = Object.values(userTypesModelNamesEnum);
        return val.every(v => models.includes(v));
      },
      message: "enter a valid models",
    },
    required: [true, "model is required"],
  },

}, {
  timestamps: true
});

export default mongoose.model("NotificationType", notificationTypeSchema);