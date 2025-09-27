const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true, index: true },
  shaNumber: { type: String, unique: true, sparse: true }, // SHA number (optional)
  name: { type: String },
  dob: { type: Date },
  gender: { type: String, enum: ['male','female','other'], default: 'other' },
  passwordHash: { type: String },
  role: { type: String, enum: ['patient','chemist','chv','admin'], default: 'patient' }
}, { timestamps: true });

userSchema.methods.setPassword = async function(pin){
  this.passwordHash = await bcrypt.hash(pin, 10);
};

userSchema.methods.validatePassword = function(pin){
  if (!this.passwordHash) return false;
  return bcrypt.compare(pin, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
