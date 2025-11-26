const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  listPatients,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientQRCode,
  searchPatient,
} = require("../controllers/patientController");
const Patient = require("../models/Patient")

// All routes require authentication
router.get("/", authMiddleware, listPatients);
router.post("/", authMiddleware, createPatient);
router.put("/:id", authMiddleware, updatePatient);
router.delete("/:id", authMiddleware, deletePatient);
router.get("/:id/qrcode", authMiddleware, getPatientQRCode);
// ✅ Search patient by SHA number
router.get("/search/:shaNumber", async (req, res) => {
  try {
    const patient = await Patient.findOne({ shaNumber: req.params.shaNumber })
      .populate("chvId", "name");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(200).json(patient); // ✅ always send JSON with 200 OK
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get patients assigned to logged-in CHV
router.get('/assigned', authMiddleware, async (req, res) => {
  try {
    // req.user is the logged-in CHV
    const chvId = req.user._id;

    const patients = await Patient.find({ chvId })
      .select('-__v') 
      .sort({ createdAt: -1 });

    res.json(patients);
  } catch (err) {
    console.error('Error fetching assigned patients:', err);
    res.status(500).json({ message: 'Server error' });
  }
});





module.exports = router;
