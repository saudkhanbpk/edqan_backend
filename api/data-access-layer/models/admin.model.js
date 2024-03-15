import mongoose from "mongoose";

import { trimAndRemoveSpaces } from '../../helper/helper.js'
import { adminRoles } from '../../security/index.js';
import { isStrongPassword } from '../../helper/validation.js';

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        
        Set: trimAndRemoveSpaces,
        unique: true,
        required: [true, "admin email is required"],
    },
    firstName: {
        type: String,
        
      },
      lastName: {
        type: String,
        
      },
    password: {
        type: String,
        required: [true, "password is required"],
        validate: [isStrongPassword, "passwords must include (letters [a-z], capital letters[A-Z], numbers[0-9], symbols and should be 12 characters or longer)"],
    },

    passwordResetToken: String,

    role: {
        type: Number,
        enum: {
            values: Object.values(adminRoles),
            message: "enter a valid user role",
        },
    },
}, {
    timestamps: true
});

const adminModel = mongoose.model('Admin', adminSchema);

export default adminModel;