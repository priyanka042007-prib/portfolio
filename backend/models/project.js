const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    technology: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    features: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model("Project", projectSchema);