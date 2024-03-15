import mongoose from 'mongoose';
import { isAlphaNumeric } from '../../helper/validation.js';

const educationLevelGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        
        required: [true, "name is required"],
        validate: [isAlphaNumeric, "enter a valid name"],
    },
    fieldsToValidate: {
        type: [String],
        required: [true, "fields is required"]
    },
}, {
    timestamps: true
});

export default mongoose.model("EducationLevelGroup", educationLevelGroupSchema);