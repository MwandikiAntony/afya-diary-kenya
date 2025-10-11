const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  stock: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
