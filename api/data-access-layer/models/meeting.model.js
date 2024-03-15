import mongoose from "mongoose";
import meetingStatusEnum from "../../types/meetingStatus.enum.js";
import meetingTypeEnum from "../../types/meetingType.enum.js";


const meetingSchema = new mongoose.Schema({
  user1: {
    type: {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      meetingUrl: {
        type: String,
      },
    },
  },
  user2: {
    type: {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      meetingUrl: {
        type: String,
      },
    },
  },
  meetingType: {
    type: String,
    enum: {
      values: Object.values(meetingTypeEnum),
      message: "enter a valid meeting type",
    },
    required: true,
  },
  status: {
    type: String,
    enum: {
      values: Object.values(meetingStatusEnum),
      message: "enter a valid status",
    },
    default: undefined,
  },
  mentorShipSession: {
    type: {
      status: {
        type: String,
        enum: {
          values: Object.values(meetingStatusEnum),
          message: "enter a valid status",
        },
        required: true,
      },
      mentorShipType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AreaInterest",
      },
      preferredLanguage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Language",
      },
      whatIsOutcomeYouAreLookingFor: {
        type: String,
        required: [true, "whatIsOutcomeYouAreLookingFor is required"],
      },
      WhyYouWouldLikeMentorShip: {
        type: String,
        required: [true, "WhyYouWouldLikeMentorShip is required"],
      },
      enterYourLinkedinOrSocialMediaSite: {
        type: String,
        default: null,
      },
      domain: {
        type: String,
        default: null,
      },
      startUpEmail: {
        type: String,
        default: null,
      },
      additionalInformation: {
        type: String,
        default: null,
      },
      mentorRating: {
        type: {
          rate: {
            type: Number,
            max: 5,
            required: [true, "rating is required"],
          },
          whatYouLiked: {
            type: String,
          },
          improvementSuggestion: {
            type: String,
          },
        },
        default: null
      },
      menteeRating: {
        type: {
          rate: {
            type: Number,
            max: 5,
            required: [true, "rating is required"],
          },
          whatYouLiked: {
            type: String,

          },
          improvementSuggestion: {
            type: String,
          },
        },
        default: null
      },
      approved: {
        type: String,
        enum: {
          values: Object.values(meetingStatusEnum),
          message: "enter a valid status",
        },
        default: meetingStatusEnum.PENDING,
      },
    },
    default: undefined,
  },
  date: {
    type: Date,
    required: [true, "date is required"],
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model("meeting", meetingSchema);
