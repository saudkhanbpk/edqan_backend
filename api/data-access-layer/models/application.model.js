import mongoose from "mongoose";
import ApplicationStatusEnum from "../../types/applicationStatus.enum.js";


const applicationSchema = new mongoose.Schema(
  {
    questionsAnswers: {
      type: [
        {
          question: {
            type: String,

          },
          answer: {
            type: String,

          },
        },
      ],
    },
    dateApplied: {
      type: Date,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(ApplicationStatusEnum),
        message: "enter a valid status",
      },
      required: true,
    },
    visibility: {
      type: Boolean,
      required: [true, "visibility option is required"],
    },
    existingCoverLetter: {
      //validate that type is cover letter based on relation
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAttachment",
      default: undefined,
    },
    coverLetterPath: {
      //validate that type is cover letter based on relation
      type: String,
      default: undefined,
    },
    existingCv: {
      //validate that type is cv based on relation
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAttachment",
      default: undefined,
    },
    cvPath: {
      //validate that type is cv based on relation
      type: String,
      default: undefined,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Application", applicationSchema);
