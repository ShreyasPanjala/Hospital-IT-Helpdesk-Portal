const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low"
    },

    status: {
        type: String,
        enum: ["Open", "In Progress", "Resolved"],
        default: "Open"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Ticket", ticketSchema);