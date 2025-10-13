const mongoose = require('mongoose');

const chemistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  licenseNumber: { type: String },
  pharmacyName: { type: String },
  role: { type: String, default: 'chemist' },
}, { timestamps: true });

module.exports = mongoose.model('Chemist', chemistSchema);
