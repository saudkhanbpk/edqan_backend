import mongoose from 'mongoose';
import { isAlpha, isAlphaNumeric } from '../../helper/validation.js';

//e.g. seasonal, full time, part time
const jobTypeSchema = new mongoose.Schema({
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
        type: Number
    }
}, {
    timestamps: true
});

export default mongoose.model("JobType", jobTypeSchema);