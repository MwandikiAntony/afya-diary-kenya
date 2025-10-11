const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    shaNumber: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // chemist or CHV
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Record', recordSchema);
