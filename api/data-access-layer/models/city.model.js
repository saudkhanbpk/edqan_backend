import mongoose from 'mongoose';
import { isAlpha, isAlphaNumeric } from '../../helper/validation.js';
import idvalidator from "mongoose-id-validator";


const citySchema = new mongoose.Schema({
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
    state_name: {
        type: String,
        required: [true, "state name is required"],
    },
    country_name: {
        type: String,
        required: [true, "country name is required"],
    },

    id: {
        type: Number
    }
},
    {
        timestamps: true
    });

citySchema.plugin(idvalidator);
export default mongoose.model("City", citySchema);