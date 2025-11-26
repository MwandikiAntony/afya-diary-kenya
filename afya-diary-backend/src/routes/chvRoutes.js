const express = require("express");
const {
  assignPatients,
  createReminder,
  getAssignedReminders, // updated name for clarity
} = require("../controllers/chvController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Assign patients
router.post("/assign", authMiddleware, roleMiddleware("chv"), assignPatients);

// Create reminder for patients
router.post("/reminders", authMiddleware, roleMiddleware("chv"), createReminder);

// Get reminders created by the CHV
router.get("/reminders/assigned", authMiddleware, roleMiddleware("chv"), getAssignedReminders);

router.get("/chvs", async (req, res) => {
  const chvs = await User.find({ role: "CHV" }).select("_id name phone");
  res.json(chvs);
});


module.exports = router;
