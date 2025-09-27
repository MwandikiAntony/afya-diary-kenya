const express = require("express");
const {
  addPrescription,
  getMyPrescriptions,
  updatePrescriptionStatus,
} = require("../controllers/prescriptionController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Chemist adds prescription
router.post("/", authMiddleware, addPrescription);

// ✅ Patient views prescriptions
router.get("/", authMiddleware, getMyPrescriptions);

// ✅ Chemist updates prescription status
router.put("/:id", authMiddleware, updatePrescriptionStatus);

module.exports = router;
