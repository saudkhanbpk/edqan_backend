import mongoose from 'mongoose';
import validator from 'validator';
// to be deleted if not used in the future
const mentorShipTypeSchema = new mongoose.Schema({
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

export default mongoose.model("MentorShipType", mentorShipTypeSchema);