import mongoose from 'mongoose';
import { isNumeric } from "../../helper/validation.js";

//TODO: implement validation that the model only contains one entry
const meetingDurationSchema = new mongoose.Schema({
  durationMinutes: {
    type: Number,
    required: [true, "duration is required"],
    validate: [isNumeric, "enter a valid duration"],
  },
}, {
  timestamps: true,
});

export default mongoose.model("meetingDuration", meetingDurationSchema);
