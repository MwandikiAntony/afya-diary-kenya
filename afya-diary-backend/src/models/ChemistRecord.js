const mongoose = require("mongoose");

const chemistRecordSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    chemistId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    diagnosis: { type: String, required: true },
    notes: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChemistRecord", chemistRecordSchema);
