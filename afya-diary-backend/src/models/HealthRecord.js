const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['diagnosis', 'medication', 'vaccine', 'allergy', 'other'], 
    required: true 
  },
  title: { type: String, required: true }, // e.g., "Diabetes", "Vitamin B12"
  description: { type: String }, // optional details
  date: { type: Date, default: Date.now },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // could be CHV, patient, chemist
}, { timestamps: true });

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
