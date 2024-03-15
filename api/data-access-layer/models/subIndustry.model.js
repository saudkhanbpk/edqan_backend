import mongoose from 'mongoose';

const subIndustrySchema = new mongoose.Schema({
    nameEn: {
        type: String,
        
        required: [true, "name is required"],
    },
    nameAr: {
        type: String,
        
        required: [true, "name is required"],
    },
    industry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Industry",
        required: [true, "industry id is required"],
    },
    order: {
        type: Number
    }
},
    {
        timestamps: true
    });

export default mongoose.model("SubIndustry", subIndustrySchema);