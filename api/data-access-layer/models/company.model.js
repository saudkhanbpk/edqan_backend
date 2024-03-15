import mongoose from "mongoose";
import { isNumeric, isAlpha, isAlphaNumeric } from "../../helper/validation.js";
import { trimAndRemoveSpaces } from "../../helper/helper.js";
import CompanyAccountVisibilityEnum from "../../types/companyAccountVisibility.enum.js";
import CompanyMediaTypeEnum from "../../types/companyMediaType.enum.js";

const companySchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      required: [true, "name is required"],
      validate: [isAlpha, "enter a valid name"],
      index: 'text', // This creates a text index on the _keywords field
      textIndexVersion: 2, // Set the minimum word length to 2
    },
    logo: {
      type: String,
      required: [true, "logo is required"],
    },
    coverPhoto: {
      type: String,
    },
    companyMedia: {
      type: [String],
      default: undefined,
      validate: {
        validator: function (v) {
          // Filter out undefined and null values and then check the length
          const nonEmptyValues = v.filter((value) => value !== undefined && value !== null);
          return nonEmptyValues.length <= 6;
        },
        message: (props) => `You can only upload a maximum of 6 attachments`,
      },
    },
    webSite: {
      type: String,
    },
    companySize: {
      type: Number,
    },
    agreeToTerms: {
      type: Boolean,
      default: true,
    },
    guideLines: {
      type: Boolean,
      required: [true, " must agree or disagree to guidelines"],
      default:true
    },
    receiveMessage: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    industries: {
      type: [
        {
          industry: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Industry",
          },
          subIndustries: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "SubIndustry",
          },
        },
      ],
    },
    phoneNumber: {
      type: String,
    },
    addresses: {
      type: [String],
    },

    headQuarters: {
      country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country",
      },
      city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
      },
      province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "province",
      },
    },

    background: {
      type: String,
    },

    jobApplicationMessages: {
      type: {
        received: {
          type: String,
        },
        hired: {
          type: String,
        },
        notSelected: {
          type: String,
        },
      },
      default: {
        received: "Thank you we have successfully received your application. Our team is currently reviewing all applications, and we will be in touch if your qualifications match our requirements. We appreciate your interest in joining our team and wish you the best in your search.",
        hired: "Congratulations! We are pleased to inform you that we are interested in offering you a position for the specified job. We believe your skills and experience align perfectly with our needs, and we look forward to discussing the details further. We will be in touch.",
        notSelected:
          "Thank you for applying for the job.We thank you for your time, but your application does not meet the specified job criteria. We value your application and encourage you to consider future opportunities with us. Wishing you the best in your job search.",
      },
 
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    
    },

    accountVisibility: {
      type: String,
      enum: {
        values: Object.values(CompanyAccountVisibilityEnum),
        message: "enter a valid account visibility",
      },
      default: CompanyAccountVisibilityEnum.PUBLIC,
    },
  },
  {
    timestamps: true,
    strictPopulate: false,
  }
);
companySchema.index({ name: "text" });

export default mongoose.model("Company", companySchema);
