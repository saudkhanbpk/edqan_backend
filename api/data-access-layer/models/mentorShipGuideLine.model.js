import mongoose from 'mongoose';
import {isAlphaNumeric } from '../../helper/validation.js';

const mentorShipGuideLineSchema = new mongoose.Schema({
    nameEn: {
        type: String,
        
        required: [true, "name is required"],
                validate: [isAlphaNumeric, "enter a valid name"],

    },
    nameAr: {
        type: String,
        
        required: [true, "name is required"],
                validate: [isAlphaNumeric, "enter a valid name"],

    },
}, 
{
    timestamps: true
});

export default mongoose.model("MentorShipGuideLine", mentorShipGuideLineSchema);