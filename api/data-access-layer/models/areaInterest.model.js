import mongoose from 'mongoose';
import { isAlpha, isAlphaNumeric } from '../../helper/validation.js';
import idvalidator from "mongoose-id-validator";


const areaInterestSchema = new mongoose.Schema({
    nameEn: {
        type: String,
        
        required: [true, "name is required"],
        validate: [isAlpha, "enter a valid name"],

    },
    nameAr: {
        type: String,
        
        required: [true, "name is required"],
        validate: [isAlphaNumeric, "enter a valid name"],

    },
    order: {
        type: Number
    }
},
    {
        timestamps: true
    });

    areaInterestSchema.plugin(idvalidator);
export default mongoose.model("AreaInterest", areaInterestSchema);