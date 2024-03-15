import mongoose from "mongoose";
import validator from "validator";
import { isAlpha, isAlphaNumeric } from "../../helper/validation.js";

const keyWaysSchema = new mongoose.Schema(
  {
    nameEn: {
      type: String,

      required: [true, "name is required"],
      validate: [isAlpha, "enter a valid nameEn"],
    },
    nameAr: {
      type: String,

      required: [true, "name is required"],
      validate: [isAlphaNumeric, "enter a valid nameAr"],
    },
    order: {
      type: Number,
    },
    icon: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("KeyWays", keyWaysSchema);
