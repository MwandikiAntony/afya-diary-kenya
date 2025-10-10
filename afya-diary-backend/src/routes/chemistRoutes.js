const express = require('express');
const router = express.Router();
const chemistController = require('../controllers/chemistController');
const authMiddleware = require('../middlewares/authMiddleware');
const { assignPatientToCHV } = require("../controllers/chemistController");

// Patient generates QR for chemist
router.post('/generate-qr', authMiddleware, chemistController.generatePatientQR);

// Chemist scans QR to get patient records
router.post('/scan-qr', authMiddleware, chemistController.scanPatientQR);
router.post('/dispense', authMiddleware, chemistController.dispenseMedication);
router.get('/dispensed/:patientId', authMiddleware, chemistController.getDispensedMedications);
router.post("/assign", authMiddleware, assignPatientToCHV);


module.exports = router;
