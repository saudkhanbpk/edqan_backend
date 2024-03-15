import mongoose from 'mongoose';
import validator from 'validator';
import { isAlpha, isAlphaNumeric } from '../../helper/validation.js';

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        
        required: [true, "name is required"],
        // validate: [isAlpha, "enter a valid name"],

    },
    native: {
        type: String,
        
        required: [true, "name is required"],
        // validate: [isAlphaNumeric, "enter a valid name"],

    },
    id: {
        type: Number
    }
},
    {
        timestamps: true
    });

export default mongoose.model("Country", countrySchema);