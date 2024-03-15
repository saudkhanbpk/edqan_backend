import mongoose from 'mongoose';
import idvalidator from "mongoose-id-validator";


const chatSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  }
}, {
  timestamps: true
});

chatSchema.plugin(idvalidator);
export default mongoose.model("Chat", chatSchema);