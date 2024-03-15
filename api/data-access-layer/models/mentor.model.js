import mongoose from "mongoose";
import genderEnum from "../../types/gender.enum.js";
import { trimAndRemoveSpaces } from "../../helper/helper.js";
import accountVisibilityEnum from "../../types/accountVisibility.enum.js";
import idvalidator from "mongoose-id-validator";


const mentorSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: {
    type: String,
    index: 'text', // This creates a text index on the _keywords field
    textIndexVersion: 2, // Set the minimum word length to 2

  },
  currentTitle: {
    type: String,
    index: 'text', // This creates a text index on the _keywords field
    textIndexVersion: 2, // Set the minimum word length to 2
  },
  about: {
    type: String,
    index: 'text', // This creates a text index on the _keywords field
    textIndexVersion: 2, // Set the minimum word length to 2
  },
  middleName: {
    type: String,
    index: 'text', // This creates a text index on the _keywords field
    textIndexVersion: 2, // Set the minimum word length to 2

  },
  almaMater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // institution user
    default: null,
  },
  lastName: {
    type: String,
    index: 'text', // This creates a text index on the _keywords field
    textIndexVersion: 2, // Set the minimum word length to 2

    required: [true, "last name is required"],
  },
  coverImage: {
    type: String,
  },

  video: {
    type: String,
  },
  linkedInUrl: {
    type: String,
    set: trimAndRemoveSpaces,
  },
  //TOASK
  company: { // have been changed from ref user to string 
    type: String,
    default: null
    // company user
  },
  mentorShipTypes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "AreaInterest",
  },
  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Major",
    default: undefined
  },
  majors: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Major",
  },
  mentoringLanguages: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Language",
  },
  industries: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Industry",
  },
  countries: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Country",
  },
  phoneNumber: {
    type: Number,
  },
  addresses: {
    type: [String],
  },
  featuredAsPublic: {
    type: Boolean,
    // required: [
    //   true,
    //   " must agree or disagree to be featured on Edqan to the public",
    // ],
    default: true
  },

  // enrolledInHighSchool: {
  //   type: Boolean,
  //   default: null,
  // },
  educationLevel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EducationLevel",
    default: null,
  },
  graduationDate: {
    type: Date,
  },
  rating: {
    type: Number,
    max: 5,
    default: 0
  },
  gender: {
    type: String,
    enum: {
      values: Object.values(genderEnum),
      message: "enter a valid gender",
    },
    required: true,
  },
  mentoringProgramPart: {
    //Are you part of a mentoring program associated with your company
    type: String,
  },
  areaOfInterest: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "AreaInterest",
  },
  agreeToTerms: {
    type: Boolean,
    required: [true, " must agree or disagree to terms"],
  },
  guideLines: {
    type: Boolean,
    // required: [true, " must agree or disagree to guidelines"],
    default: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  accountVisibility: {
    type: String,
    enum: {
      values: Object.values(accountVisibilityEnum),
      message: "enter a valid account visibility",
    },
    default: accountVisibilityEnum.COMMUNITY,
  },
  availabilityTime: {
    type: [Date]
  },
}, {
  timestamps: true,
  strictPopulate: false
});

mentorSchema.index({ firstName: "text", lastName: "text", middleName: "text" });

// mentorSchema.plugin(idvalidator);
export default mongoose.model("Mentor", mentorSchema);
