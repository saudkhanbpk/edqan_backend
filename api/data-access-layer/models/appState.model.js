import mongoose from "mongoose";

const appStateSchema = new mongoose.Schema({
    inMaintenance: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const appStateModel = mongoose.model('AppState', appStateSchema);

export default appStateModel;