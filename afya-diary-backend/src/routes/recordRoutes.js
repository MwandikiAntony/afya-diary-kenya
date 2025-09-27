const express = require("express");
const router = express.Router();
const recordController = require("../controllers/recordController");
const authMiddleware = require("../middlewares/authMiddleware");

// Add record (protected)
router.post("/", authMiddleware, recordController.addRecord);

// Get my records (protected)
router.get("/", authMiddleware, recordController.getMyRecords);

module.exports = router;
