const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chemist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // we assume chemists are also users
      required: true,
    },
    medication: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "dispensed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
