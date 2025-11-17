const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const chvSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  shaNumber: { type: String, required: true, unique: true }, // shared with patients & chemists
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'chv' },
}, { timestamps: true });

// Hash password before saving
chvSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// compare password
chvSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Chv', chvSchema);
