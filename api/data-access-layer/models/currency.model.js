import mongoose from 'mongoose';
import { isAlphaNumeric, isAlpha } from '../../helper/validation.js';

const currencySchema = new mongoose.Schema({
    nameEn: {
        type: String,
        
        required: [true, "name is required"],
        // validate: [isAlpha, "enter a valid name"],

    },
    nameAr: {
        type: String,
        
        required: [true, "name is required"],
        // validate: [isAlphaNumeric, "enter a valid name"],

    },
    order: {
        type: Number
    }
},
    {
        timestamps: true
    });

export default mongoose.model("Currency", currencySchema);