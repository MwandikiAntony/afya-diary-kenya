const mongoose = require('mongoose');

const dispensedMedicationSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chemistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medication: { type: String, required: true },
  dose: { type: String },          // e.g., "500mg twice daily"
  instructions: { type: String },  // optional notes
  dispensedAt: { type: Date, default: Date.now },
  followUpReminder: { type: mongoose.Schema.Types.ObjectId, ref: 'Reminder' }, // optional
}, { timestamps: true });

module.exports = mongoose.model('DispensedMedication', dispensedMedicationSchema);
