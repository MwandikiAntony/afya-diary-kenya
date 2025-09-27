const mongoose = require('mongoose');

const healthTipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  content: { type: String },
  language: { type: String, enum: ['en','sw'], default: 'en' }
}, { timestamps: true });

module.exports = mongoose.model('HealthTip', healthTipSchema);
