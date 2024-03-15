import mongoose from 'mongoose';
import { isAlphaNumeric, isAlpha } from "../../helper/validation.js";

const languageSchema = new mongoose.Schema({
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
},
    {
        timestamps: true
    });

export default mongoose.model("Language", languageSchema);