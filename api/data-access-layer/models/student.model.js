import mongoose from "mongoose";
import genderEnum from "../../types/gender.enum.js";
import accountVisibilityEnum from "../../types/accountVisibility.enum.js";
import { isEmail } from "../../helper/validation.js";
import { trimAndRemoveSpaces } from "../../helper/helper.js";
// import idvalidator from "mongoose-id-validator";


const studentSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {
      type: String,
      index: 'text', // This creates a text index on the _keywords field
      textIndexVersion: 2, // Set the minimum word length to 2

    },
    middleName: {
      type: String,
      index: 'text', // This creates a text index on the _keywords field
      textIndexVersion: 2, // Set the minimum word length to 2

    },
    lastName: {
      type: String,
      index: 'text', // This creates a text index on the _keywords field
      textIndexVersion: 2, // Set the minimum word length to 2

    },
    secondaryEmail: {
      type: String,
      unique: true,
      sparse: true,
      default: undefined,
      validate: [isEmail, "enter a valid email"],
      index: 'text', // This creates a text index on the _keywords field
      textIndexVersion: 2, // Set the minimum word length to 2
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fluentLanguage: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Language",
      validate: {
        validator: function (v) {
          // Filter out undefined and null values and then check the length
          const nonEmptyValues = v.filter((value) => value !== undefined && value !== null);
          return nonEmptyValues.length <= 30;
        },
        message: (props) => `You can only choose a maximum of 30 fluent Language`,
      },
    },
    proficientLanguage: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Language",
      validate: {
        validator: function (v) {
          // Filter out undefined and null values and then check the length
          const nonEmptyValues = v.filter((value) => value !== undefined && value !== null);
          return nonEmptyValues.length <= 30;
        },
        message: (props) => `You can only choose a maximum of 30 proficient Language`,
      },
    },
    enrolledInHighSchool: {
      type: Boolean,
    },
    major: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Major",
    },
    graduationDate: {
      type: Date,
    },
    areaOfInterest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AreaInterest",
    },
    educationLevel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EducationLevel",
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default:null
    },
    careerInterest: {
      type: {
        workType: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "WorkType",
        },
        jobRole: {
          type: [mongoose.Schema.Types.ObjectId],
          required: [true, "job role is required"],
          ref: "JobRole",
        }, //shoulde be remobed but needs to be reviewed one more time
        subIndustry: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "SubIndustry",
        },
        country: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "Country",
        },
      },

      default: undefined,
    },
    //TOASK: why verified at instead of verified flag
    emailVerifiedAt: {
      type: Date,
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(genderEnum),
        message: "enter a valid gender",
      },
      required: true,
    },
    brief: {
      type: String,

      default: null,
    },
    education: {
      type: [
        {
          educationLevel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EducationLevel",
          },
          major: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Major",
          },
          university: {
            type: String,
          },
          minor: {
            type: String,
          },
          startingDate: {
            type: Date,
          },
          endingDate: {
            type: Date,
          },
          gpa: {
            type: String,
            max: 5.0,
          },
          graduationDate: {
            type: Date,
          }
        },
      ],
    },
    student: {
      type: Boolean,
    },

    gpa: {
      type: String,
      max: 5.0,
      default: 0,
    },
    volunteers: {
      type: [
        {
          company: {
            type: String,
          },
          description: {
            type: String,
          },
          role: {
            type: String,
          },
          startingDate: {
            type: Date,
          },
          endingDate: {
            type: Date,
          },
          city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "City",
          },
          province: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "province",
          },
          country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Country",
          },
          // duration: {
          //   type: String,
          // },
        },
      ],
    },
    accountVisibility: {
      type: String,
      enum: {
        values: Object.values(accountVisibilityEnum),
        message: "enter a valid account visibility",
      },
      default: accountVisibilityEnum.EMPLOYER,
    },
    skills: {
      type: [String],
      validate: {
        validator: function (v) {
          // Filter out undefined and null values and then check the length
          const nonEmptyValues = v.filter((value) => value !== undefined && value !== null);
          return nonEmptyValues.length <= 30;
        },
        message: (props) => `You can only choose a maximum of 30 Skills`,
      },
    },
    organizations: {
      type: [String],
    },
    courses: {
      type: [
        {
          name: {
            type: String,
            required: [true, "name is required"],
          },
          url: {
            type: String,
            // required: [true, "url is required"],
          },
        },
      ],
    },
    projects: {
      type: [
        {
          name: {
            type: String,
          },
          role: {
            type: String,
          },
          description: {
            type: String,
          },
          startingDate: {
            type: Date,
          },
          endingDate: {
            type: Date,
          },
          url: {
            type: String,
          },
          owner: {
            type: String,
          },
          city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "City",
          },
          province: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "province",
          },
          country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Country",
          },
        },
      ],
      required: [false],
    },

    jobMajors: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Major",
    },

    savedJobs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Job",
      default: undefined,
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

    followedCompanies: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: undefined,
      validate: {
        validator: function (arr) {
          const maxLength = 3000;
          return arr.length <= maxLength;
        },
        message: 'Followed companies exceeds the maximum allowed length'
      }
    },
    followedInstitutions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: undefined,
      validate: {
        validator: function (arr) {
          const maxLength = 3000;
          return arr.length <= maxLength;
        },
        message: 'Followed institutions exceeds the maximum allowed length'
      }
    },
  }, {
  timestamps: true,
  // _id: false
  strictPopulate: false
}
);

function isEnrolled() {
  if (this.enrolledHighSchool) {
    return true;
  }
  return false;
}
studentSchema.index({ firstName: "text", lastName: "text" , middleName: "text" });
// studentSchema.plugin(idvalidator);
export default mongoose.model("Student", studentSchema);
