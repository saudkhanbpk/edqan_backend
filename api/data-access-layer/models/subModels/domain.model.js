import mongoose from 'mongoose';
import { isAlphaNumeric } from '../../../helper/validation.js';

const domainSchema = new mongoose.Schema({
    name: {
        type: String,
        
        required: [true, "name is required"],
        validate: [isAlphaNumeric, "enter a valid name"],
    }
}, {
    timestamps: true
});

export default mongoose.model("Domain", domainSchema);