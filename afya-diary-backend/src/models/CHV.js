const mongoose = require("mongoose");

const chvSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The CHV is also a user
      required: true,
    },
    assignedPatients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Patients under the CHV
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CHV", chvSchema);
