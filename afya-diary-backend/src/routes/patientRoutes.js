const express = require('express');
const auth = require('../middlewares/authMiddleware'); // ensures req.user
const role = require('../middlewares/roleMiddleware');
const router = express.Router();
const QRCode = require("qrcode");
const User = require("../models/User");
const ctrl = require('../controllers/patientController');
const { listPatients, createPatient, updatePatient, deletePatient } = require("../controllers/patientController");
const authMiddleware = require("../middlewares/authMiddleware");


router.get("/", authMiddleware, listPatients);
router.post("/", authMiddleware, createPatient);
router.put("/:id", authMiddleware, updatePatient);
router.delete("/:id", authMiddleware, deletePatient);


// GET /api/patients/:id/qrcode
router.get("/:id/qrcode", async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await User.findById(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const qrData = patient._id.toString(); // or patient.phone / patient.email
    const qrImage = await QRCode.toDataURL(qrData);

    res.json({ qrImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating QR code" });
  }
});



module.exports = router;
