import mongoose from 'mongoose';
import validator from 'validator';

const majorSchema = new mongoose.Schema({
    nameEn: {
        type: String,
        
        required: [true, "name is required"],
    },
    nameAr: {
        type: String,
        
        required: [true, "name is required"],
    },
    order: {
        type: Number
    }
}, {
    timestamps: true
});

export default mongoose.model("Major", majorSchema);