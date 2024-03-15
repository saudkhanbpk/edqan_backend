import mongoose from "mongoose";
import { isAlphaNumeric, isNumeric } from "../../helper/validation.js";
import { trimAndRemoveSpaces } from "../../helper/helper.js";
import workAuthorizationEnum from "../../types/workAuthorization.enum.js";
import idvalidator from "mongoose-id-validator";


const jobSchema = new mongoose.Schema({
  name: {
    type: String,
    index: 'text', // This creates a text index on the _keywords field
    textIndexVersion: 2, // Set the minimum word length to 2
    required: [true, " name is required"],
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  jobType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobType",
    required: [true, "job type is required"],
  },
  industry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Industry",
  },
  subIndustry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubIndustry",
  },
  workType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkType",
    required: [true, "work type is required"],
  },
  applicationType: {
    type: String,
    enum: {
      values: ["internal", "external"],
      message: "enter a valid application type",
    },
    required: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    default: null
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    default: null
  },
  province: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "province",
    default: null
  },
  applicationUrl: {
    type: String,
  },

  additionalComments: {
    type: String,
    default: null,
  },
  hoursPerWeek: {
    type: Number,
    required: [true, "hours per week is required"],
    validate: [isNumeric, "enter a valid hoursPerWeek"],
  },
  benefits: {
    type: String,
    set: trimAndRemoveSpaces,
  },
  views: {
    type: Number,
    default: 0,
  },
  roleDescription: {
    type: String,
    required: [true, "role description is required"],
    set: trimAndRemoveSpaces,
    index: 'text', // This creates a text index on the _keywords field
    textIndexVersion: 2 // Set the minimum word length to 2
  },
  moreDetails: {
    type: String,
    required: [false],
    set: trimAndRemoveSpaces,
  },
  deadLine: {
    type: Date,
  },
  workAuthorization: {
    type: Number,
    enum: {
      values: Object.values(workAuthorizationEnum),
      message: "enter a valid work authorization",
    },
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Major",
  },

  jobPreference: {
    type: {
      major: {
        type: Boolean,
      },
      fluentLanguage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Language",
      },
      languageProficiency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Language",
      },

      location: {
        type: Boolean
      },
      gpa: {
        type: String,
        max: 5,
      },
      graduationDate: {
        type: Date,
      },
    },
  },
  questions: {
    type: [{
      _id: mongoose.Schema.Types.ObjectId,
      question: {
        // edit in entity
        type: String,
        required: [true, "question id is required"],
      },
      questionType: {
        type: String,
        enum: {
          values: ["choice", "text"],
          message: "enter a valid question type",
        },
        required: true,
      },
      questionChoices: {
        type: [String],
        default: undefined,
      },
    }],
  },
  currency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Currency",
  },
  salary: {
    type: Number,
  },
  datePosted: {
    type: Date
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "declined", "approved"],
      message: "enter a valid status",
    },
    default: "pending",
  },
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true
});

jobSchema.plugin(idvalidator);
jobSchema.index({ name: "text", roleDescription: "text" });
const jobModel = mongoose.model("Job", jobSchema);
export default jobModel;
