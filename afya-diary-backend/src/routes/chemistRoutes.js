const express = require('express');
const router = express.Router();
const authenticate  = require('../middlewares/authMiddleware');
const chemistController = require('../controllers/chemistController');

// Create a walk-in patient
router.post('/create-patient', authenticate, chemistController.createPatient);

// Generate patient QR (for patient)
router.post('/generate-qr', authenticate, chemistController.generatePatientQR);

// Chemist scans QR to get patient records
router.post('/scan-qr', authenticate, chemistController.scanPatientQR);

// Chemist dispenses medication
router.post('/dispense', authenticate, chemistController.dispenseMedication);

// ✅ Fetch all dispensed medications for logged-in chemist
router.get('/dispenses', authenticate, async (req, res) => {
  try {
    const DispensedMedication = require('../models/DispensedMedication');
    const records = await DispensedMedication.find({ chemistId: req.user._id })
      .populate('patientId', 'name email')
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    console.error('Error fetching chemist dispenses', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Fetch dispensed medications for a specific patient
router.get('/dispensed/:patientId', authenticate, chemistController.getDispensedMedications);

// Assign patient to CHV
router.post('/assign-chv', authenticate, chemistController.assignPatientToCHV);

module.exports = router;
