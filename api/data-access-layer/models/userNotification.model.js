import mongoose from 'mongoose';
import notificationStatusEnum from '../../types/notificationStatus.enum.js';
import { trimAndRemoveSpaces } from '../../helper/helper.js';

const MAX_NOTIFICATIONS = 30; // Define the maximum number of notifications
const userNotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true
  },
  //TODO: should implement a validation to push images into the existing array and keep the array to a fixed length
  notifications: {
    type: [{
      text: {
        type: String,
        required: [true, "notification is required"],
        set: trimAndRemoveSpaces,
      },
      notificationLink: {
        type: String,
        set: trimAndRemoveSpaces,
      },
      status: {
        type: Number,
        enum: {
          values: Object.values(notificationStatusEnum),
          message: "enter a valid status",
        },
        default: notificationStatusEnum.UNREAD,
        required: true
      },
    }]
  }
}, {
  timestamps: true
});

// A pre middleware for 'save' to limit the notifications array
userNotificationSchema.pre('save', function (next) {
  if (this.notifications.length > MAX_NOTIFICATIONS) {
    this.notifications.splice(0, this.notifications.length - MAX_NOTIFICATIONS);
  }
  next();
});

// A pre middleware for 'findByIdAndUpdate' to limit the notifications array
userNotificationSchema.pre('findByIdAndUpdate', function (next) {
  if (this._update.notifications && this._update.notifications.length > MAX_NOTIFICATIONS) {
    this._update.notifications = this._update.notifications.slice(-MAX_NOTIFICATIONS);
  }
  next();
});

export default mongoose.model("UserNotification", userNotificationSchema);