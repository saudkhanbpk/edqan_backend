import mongoose from "mongoose";

// Import your Company model and companySchema
import Company from "./company.model.js" //Update the import path to match your project structure

// Create a CompanyVersion schema dynamically by cloning the Company schema fields
const companyVersionSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    // Include all fields from the Company schema
    ...Company.schema.obj,

    createdAt: {
      type: Date,
      default: Date.now,
    },
    flag: {
      type: Boolean,
      default: true
    }
  },
  {
    strict: false, // Allows additional fields not defined in the schema
  }
);

export default mongoose.model("CompanyVersion", companyVersionSchema);
