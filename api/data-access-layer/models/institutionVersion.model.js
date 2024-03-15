import mongoose from "mongoose";

// Import your Company model and companySchema
import Institution from "./institution.model.js" //Update the import path to match your project structure

// Create a CompanyVersion schema dynamically by cloning the Company schema fields
const institutionVersionSchema = new mongoose.Schema(
  {
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
    },

    // Include all fields from the Company schema
    ...Institution.schema.obj,

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

export default mongoose.model("InstitutionVersion", institutionVersionSchema);
