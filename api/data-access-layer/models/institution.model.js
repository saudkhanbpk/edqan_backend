import mongoose from 'mongoose';
import validator from 'validator';
import { isAlphaNumeric, isNumeric, isAlpha, isEmail } from '../../helper/validation.js';
import { trimAndRemoveSpaces } from '../../helper/helper.js';
import InstitutionPrivacyEnum from '../../types/institutionPrivacy.enum.js';
import idvalidator from "mongoose-id-validator";


const institutionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        
        required: [true, "name is required"],
        validate: [isAlpha, "enter a valid name"],
        index: 'text', // This creates a text index on the _keywords field
        textIndexVersion: 2, // Set the minimum word length to 2
    },
    logo: {
        type: String,
        required: [true, "logo is required"],
    },
    banner: {
        type: String,
        required: [true, "banner is required"],
    },
    emailVerifiedAt: {
        type: Date
    },
    addresses: [{
        type: String,
        validate: [isAlpha, "enter a valid address"],
    }],
    background: {
        type: String,
        required: [true, ' background is required']
    },
    careerAdvisingPhone: {
        type: String,
        required: [true, ' career Advising Phone number is required'],
    },
    careerAdvisingEmail: {
        type: String,
        sparse: true,
        unique: true,
        index: 'text', // This creates a text index on the _keywords field
        textIndexVersion: 2, // Set the minimum word length to 2

    },
    schoolUrl: {
        type: String,
        unique: true,
        sparse: true,

    
    },
    careerAdvisingLocation: {
        country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Country",
        },
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "City",
        },
        province: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "province",
          },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    accountVisibility: {
        type: String,
        enum: {
            values: Object.values(InstitutionPrivacyEnum),
            message: "enter a valid privacy",
        },
    },
}, {
    timestamps: true,
    strictPopulate: false
});

institutionSchema.index({ name: "text"});

// institutionSchema.plugin(idvalidator);
export default mongoose.model("Institution", institutionSchema);