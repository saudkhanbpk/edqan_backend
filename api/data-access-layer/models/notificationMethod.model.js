import mongoose from 'mongoose';
import notificationMethodEnum from '../../types/notificationMethod.enum.js';

const notificationMethodSchema = new mongoose.Schema({

  kind: { 
    type: Number,
    index: true,
    unique: true,
    required: [true, " notification method name is required"],
    enum: {
      values: Object.values(notificationMethodEnum),
      message: "enter a valid notification method",
    },
  },
  name: {
    type: String,
    required: [true, " notification method is required"],
  }
}, {
  timestamps: true
});

export default mongoose.model("NotificationMethod", notificationMethodSchema);