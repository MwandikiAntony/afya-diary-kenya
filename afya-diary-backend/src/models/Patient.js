const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  phone: { type: String, required: true, unique: true, index: true },
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'male', 'female', 'other'] 
},
  shaNumber: { type: String },
  qrCode: { type: String, unique: true },
  // Optional: owner CHV userid
  chvId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
