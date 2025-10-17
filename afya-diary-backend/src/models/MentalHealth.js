const mongoose = require('mongoose');

const mentalHealthSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: String },         // e.g., "Happy", "Sad", "Anxious"
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MentalHealth', mentalHealthSchema);
