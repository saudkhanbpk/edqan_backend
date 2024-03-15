import mongoose from 'mongoose';
import { isAlphaNumeric } from '../../../helper/validation.js';

const typeOfWorkSchema = new mongoose.Schema({
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
    order: {
        type: Number
    }
}, {
    timestamps: true
});

export default mongoose.model("TypeOfWork", typeOfWorkSchema);