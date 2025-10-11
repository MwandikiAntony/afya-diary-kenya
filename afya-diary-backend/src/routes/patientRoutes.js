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

// All routes require authentication
router.get("/", authMiddleware, listPatients);
router.post("/", authMiddleware, createPatient);
router.put("/:id", authMiddleware, updatePatient);
router.delete("/:id", authMiddleware, deletePatient);
router.get("/:id/qrcode", authMiddleware, getPatientQRCode);
// ✅ Search patient by SHA number
router.get("/search/:shaNumber", searchPatient);




module.exports = router;
