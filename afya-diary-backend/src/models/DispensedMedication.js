const mongoose = require('mongoose');

const dispensedSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  chemistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  medicineName: { type: String },
  dose: { type: String },
  instructions: { type: String },
  quantity: { type: Number, default: 1 },
  followUpReminder: { type: mongoose.Schema.Types.ObjectId, ref: 'Reminder' },
}, { timestamps: true });

module.exports = mongoose.model('DispensedMedication', dispensedSchema);
