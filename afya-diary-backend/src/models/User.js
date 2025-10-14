// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true, index: true },
  shaNumber: { type: String, unique: true, sparse: true }, // SHA number for all roles
  name: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  email: { type: String, unique: true, sparse: true }, // For CHV & Chemist
  passwordHash: { type: String }, // For CHV & Chemist
  role: { type: String, enum: ['patient','chemist','chv','admin'], default: 'patient' },
  licenseNumber: { type: String, sparse: true }, // For Chemist
  pharmacyName: { type: String, sparse: true }   // For Chemist
}, { timestamps: true });

// Set password
userSchema.methods.setPassword = async function(pin){
  this.passwordHash = await bcrypt.hash(pin, 10);
};

// Validate password
userSchema.methods.validatePassword = function(pin){
  if (!this.passwordHash) return false;
  return bcrypt.compare(pin, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
