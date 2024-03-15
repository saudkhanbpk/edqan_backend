import mongoose from 'mongoose';

const companyFollowerSchema = new mongoose.Schema({
  
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
}, 
{
    timestamps: true
});

export default mongoose.model("CompanyFollower", companyFollowerSchema);