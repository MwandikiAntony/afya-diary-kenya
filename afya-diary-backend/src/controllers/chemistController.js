const QRToken = require('../models/QRToken');
const HealthRecord = require('../models/HealthRecord');
const jwt = require('jsonwebtoken');
const DispensedMedication = require('../models/DispensedMedication');
const Reminder = require('../models/Reminder');

const User = require('../models/User');

// Generate QR token for patient
exports.generatePatientQR = async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Only patients can generate QR' });
    }

    const token = jwt.sign({ patientId: req.user._id }, process.env.QR_JWT_SECRET, { expiresIn: '1h' });

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await QRToken.create({
      patientId: req.user._id,
      token,
      expiresAt,
    });

    res.json({ qrToken: token });
  } catch (err) {
    console.error('generatePatientQR error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Scan QR token to get patient records
exports.scanPatientQR = async (req, res) => {
  try {
    if (req.user.role !== 'chemist') {
      return res.status(403).json({ message: 'Only chemists can scan QR' });
    }

    const { qrToken } = req.body;
    if (!qrToken) return res.status(400).json({ message: 'QR token required' });

    // Verify JWT
    let payload;
    try {
      payload = jwt.verify(qrToken, process.env.QR_JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired QR token' });
    }

    const records = await HealthRecord.find({ patientId: payload.patientId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error('scanPatientQR error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Chemist records dispensed medication
exports.dispenseMedication = async (req, res) => {
  try {
    if (req.user.role !== 'chemist') {
      return res.status(403).json({ message: 'Only chemists can dispense medications' });
    }

    const { patientId, medication, dose, instructions, followUpDays } = req.body;
    if (!patientId || !medication) return res.status(400).json({ message: 'patientId and medication required' });

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Create dispensed medication record
    const dispensed = await DispensedMedication.create({
      patientId,
      chemistId: req.user._id,
      medication,
      dose,
      instructions,
    });

    // Optional: create follow-up reminder
    if (followUpDays && Number(followUpDays) > 0) {
      const reminder = await Reminder.create({
        patientId,
        message: `Time for follow-up or next dose of ${medication}`,
        dueDate: new Date(Date.now() + followUpDays * 24 * 60 * 60 * 1000), // X days later
        status: 'pending',
        createdBy: req.user._id,
      });
      dispensed.followUpReminder = reminder._id;
      await dispensed.save();
    }

    res.status(201).json(dispensed);
  } catch (err) {
    console.error('dispenseMedication error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// GET /api/chemist/dispensed/:patientId
exports.getDispensedMedications = async (req, res) => {
  try {
    if (!['chemist', 'chv', 'patient'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { patientId } = req.params;
    const records = await DispensedMedication.find({ patientId }).sort({ dispensedAt: -1 });
    res.json(records);
  } catch (err) {
    console.error('getDispensedMedications error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

