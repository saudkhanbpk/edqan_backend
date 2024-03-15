import mongoose from "mongoose";
import {
  isEmail,
  isStrongPassword,
  isValidUrl,
} from "../../helper/validation.js";
import userModels from "../../types/userTypesModelNames.enum.js";
import notificationTypeEnum from "../../types/notificationType.enum.js";
import notificationMethodEnum from "../../types/notificationMethod.enum.js";

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    unique: true,
    validate: [isEmail, "enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    validate: [isStrongPassword, "enter a strong password"],
  },
  model: {
    type: String,
    required: [true, "model is required"],
    enum: {
      values: Object.values(userModels), // TODO model's name for institution , company , etc
      message: "enter a valid user role",
    },
  },
  subModel: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "model",
    required: [true, "model id is required"],

  },
  passwordResetToken: String,
  verificationToken: String,
  verified: {
    type: Boolean,
    default: false,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    type: String,
  },
  notificationSettings: {
    type: [{
      notificationType: {
        type: Number,
        enum: {
          values: Object.values(notificationTypeEnum),
          message: "enter a valid notification type",
        },
      },
      notificationMethod: {
        type: [Number],
        validate: {
          validator: async (notificationMethods) => {
            for (const notificationMethod of notificationMethods) {
              if (!Object.values(notificationMethodEnum).includes(notificationMethod)) return false;
              return true;
            }
          },
          message: "enter a valid education",
        },
      },
    }],
  },
  socialMediaLinks: {
    type: [{
      socialMedia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SocialMedia",
      },
      url: [
        {
          type: String,
        },
      ],
    }],

    default: undefined,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
  },
  province: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "province",
  },

  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
  },
  newUpdate: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
  strictPopulate: false
});

export default mongoose.model("User", userSchema);
