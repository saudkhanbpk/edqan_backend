import mongoose from 'mongoose';
import educationTypeEnum from '../../types/educationType.enum.js';

const educationLevelSchema = new mongoose.Schema({
    nameEn: {
        type: String,
        
        required: [true, "name is required"],
    },
    nameAr: {
        type: String,
        
        required: [true, "name is required"],
    },
    enrolledHighSchool: {
        type: Boolean,
        required: [true, "enrolled in high school is required"],
    },
    order: {
        type: Number
    },
    educationLevelGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EducationLevelGroup",
    },
}, {
    timestamps: true
});

export default mongoose.model("EducationLevel", educationLevelSchema);