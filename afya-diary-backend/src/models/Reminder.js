const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who created the reminder
    message: { type: String, required: true },
    dueDate: { type: Date, required: true },
    sent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminder", reminderSchema);
