import mongoose from 'mongoose';

//e.g. remote, in person, hybrid
const workTypeSchema = new mongoose.Schema({
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
},
    {
        timestamps: true
    });

export default mongoose.model("WorkType", workTypeSchema);