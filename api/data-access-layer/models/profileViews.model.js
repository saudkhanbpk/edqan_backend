import mongoose from "mongoose";

const profileViewsSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: [{
      date: {
        type: Date,
        default: Date.now,
      },
    }],
  },{
    timestamps: true,
    });
  
    export default mongoose.model("ProfileViews", profileViewsSchema);

  