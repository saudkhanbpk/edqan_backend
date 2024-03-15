import mongoose from "mongoose";
import { isNumeric } from "../../helper/validation.js";
import { trimAndRemoveSpaces } from "../../helper/helper.js";
import idvalidator from "mongoose-id-validator";


const reviewSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: [true, "job title is required"],
    set: trimAndRemoveSpaces,
  },
  // review: {
  //   type: String,
  //   required: [true, "review is required"],
  //   set: trimAndRemoveSpaces,
  // },
  resourcesFindingJob: {
    type: String,

    required: [true, "ResourcesFindingJob are required"],
  },
  approved: {
    type: String,
    enum: {
      values: ["pending", "declined", "approved"],
      message: "enter a valid status",
    },
    default: "pending",
  },
  advicesForOthers: {
    type: String,
    set: trimAndRemoveSpaces,
  },
  whatYouLikedAndLearned: {
    type: String,
    required: [true, "what you liked and learned is required"],
    set: trimAndRemoveSpaces,
  },
  typeOfWork: {
    // in the front end data should be collected from job type
    type: String,
    required: [true, "type of work is required"],
  },
  keyWays: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "KeyWays",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  salary: {
    type: Number,
    validate: [isNumeric, "enter a valid question ID"],
  },
  currency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Currency",
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  startDate: {
    type: Date,
    required: [true, "start date is required"],
  },
  endDate: {
    type: Date,
  },
  addToProfile: {
    type: Boolean,
    required: [true, "add to profile is required"],
  },
  didYouGetOffer: {
    type: {
      answer: { type: String },
      visibility: { type: Boolean },
    },
  },
  howOftenDidYouGetPaid: {
    type: String,
  },
  agreeToTerms: {
    type: Boolean,
    required: [true, " must agree or disagree to terms"],
  },
}, {
  timestamps: true,
});

reviewSchema.plugin(idvalidator);
export default mongoose.model("Review", reviewSchema);
