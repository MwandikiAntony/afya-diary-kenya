const express = require('express');
const router = express.Router();

// ✅ Import middleware and controller
const authMiddleware = require('../middlewares/authMiddleware'); // make sure the folder is singular
const chemistController = require('../controllers/chemistController');
const DispensedMedication = require('../models/DispensedMedication');

// ✅ Create a walk-in patient
router.post('/create-patient', authMiddleware, chemistController.createPatient);

// ✅ Generate patient QR (for patient)
router.post('/generate-qr', authMiddleware, chemistController.generatePatientQR);

// ✅ Chemist scans QR to get patient records
router.post('/scan-qr', authMiddleware, chemistController.scanPatientQR);

// ✅ Chemist dispenses medication
router.post('/dispense', authMiddleware, chemistController.dispenseMedication);

// ✅ Fetch all dispensed medications for logged-in chemist
router.get('/dispenses', authMiddleware, async (req, res) => {
  try {
    const records = await DispensedMedication.find({ chemistId: req.user.userId })
      .populate('patientId', 'name email shaNumber')
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    console.error('Error fetching chemist dispenses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Assign patient to CHV
router.post('/assign-chv', authMiddleware, chemistController.assignPatientToCHV);

// ✅ Add new medicine to stock
router.post('/add-medicine', authMiddleware, chemistController.addMedicine);

// ✅ Fetch all medicines for dropdown when dispensing
router.get('/medicines', authMiddleware, chemistController.getMedicines);

// ✅ Add patient medical record
router.post('/add-record', authMiddleware, chemistController.addPatientRecord);

// ✅ Chemist profile (fixes your 404)
router.get('/profile', authMiddleware, chemistController.getChemistProfile);


module.exports = router;
