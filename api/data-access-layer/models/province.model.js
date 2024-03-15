import mongoose from 'mongoose';

const provinceSchema = new mongoose.Schema({
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

export default mongoose.model("province", provinceSchema);