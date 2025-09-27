const mongoose = require('mongoose');

const chemistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    location: { type: String },
    licenseNumber: { type: String, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chemist', chemistSchema);
