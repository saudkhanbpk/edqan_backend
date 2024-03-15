import mongoose from "mongoose";

import User from "./user.model.js";

// Create a UserVersion schema dynamically by cloning the User schema fields
const userVersionSchema = new mongoose.Schema(
  {
    // Include the user_id field to reference the original user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ...User.schema.obj,
    flag: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    email: {
      type: String,
    },
    
  },
);
userVersionSchema.index({ email_text: 1 }, { unique: false });

export default mongoose.model("UserVersion", userVersionSchema);

