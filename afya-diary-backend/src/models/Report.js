const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  notes: { type: String },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: false },
  // which CHV submitted
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // optional metadata
  location: { type: String },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
