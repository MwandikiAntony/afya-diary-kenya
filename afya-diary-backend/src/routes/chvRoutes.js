const express = require("express");
const {
  assignPatients,
  createReminder,
  getReminders,
} = require("../controllers/chvController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Assign patients
router.post("/assign", authMiddleware, assignPatients);

// ✅ Create reminder
router.post("/reminders", authMiddleware, createReminder);

// ✅ Get reminders
router.get("/reminders", authMiddleware, getReminders);

module.exports = router;
