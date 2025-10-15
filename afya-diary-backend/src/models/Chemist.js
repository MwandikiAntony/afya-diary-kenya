const mongoose = require('mongoose');


const chemistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  licenseNumber: { type: String, unique: true, sparse: true }, // ✅ add sparse
  pharmacyName: { type: String },
  email: { type: String },
  phone: { type: String },
}, { timestamps: true });


module.exports = mongoose.model('Chemist', chemistSchema);
