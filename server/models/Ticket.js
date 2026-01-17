const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    createdByEmail: {
      type: String,
      required: true
    },
    issue: {
      type: String,
      required: true
    },

    /* ✅ NEW FIELD */
    answer: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["resolved", "not_resolved"],
      default: "not_resolved"
    },
    resolvedBy: {
      type: String,
      default: ""
    },
    resolvedOn: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
