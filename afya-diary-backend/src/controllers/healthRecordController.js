const HealthRecord = require('../models/HealthRecord');
const User = require('../models/User');

// Add a health record
exports.addRecord = async (req, res) => {
  try {
    const { type, title, description, patientId } = req.body;

    // Only allow patients, CHVs, or chemists to add
    if (!['patient', 'chemist', 'chv'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const record = await HealthRecord.create({
      patientId,
      type,
      title,
      description,
      addedBy: req.user._id,
    });

    res.status(201).json(record);
  } catch (err) {
    console.error('addRecord error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all health records for a patient
exports.getRecords = async (req, res) => {
  try {
    const patientId = req.query.patientId || req.user._id;

    // Patients can see their own records
    if (req.user.role === 'patient' && patientId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const records = await HealthRecord.find({ patientId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error('getRecords error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
