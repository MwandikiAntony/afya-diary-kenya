const mongoose = require('mongoose');

const chemistAccessSchema = new mongoose.Schema({
  chemistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  grantedAt: { type: Date, default: Date.now },
  expiry: { type: Date, required: true } // e.g. 15 minutes from grant
}, { timestamps: true });

chemistAccessSchema.index({ patientId:1, chemistId:1 });

module.exports = mongoose.model('ChemistAccess', chemistAccessSchema);
