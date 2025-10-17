const express = require("express");
const router = express.Router();
const {
  logMood,
  getMoodHistory
} = require("../controllers/mentalHealthController");

// POST /api/mental-health/log
router.post("/log", logMood);

// GET /api/mental-health/:userId
router.get("/:userId", getMoodHistory);

module.exports = router;
