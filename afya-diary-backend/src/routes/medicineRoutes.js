// routes/medicineRoutes.js
const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine");
const auth = require("../middlewares/authMiddleware");

// GET all
router.get("/", auth, async (req, res) => {
  const meds = await Medicine.find().sort({ name: 1 });
  res.json(meds);
});

// POST new
router.post("/", auth, async (req, res) => {
  const med = await Medicine.create({ ...req.body, addedBy: req.user._id });
  res.status(201).json(med);
});

// PUT update
router.put("/:id", auth, async (req, res) => {
  const med = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(med);
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  await Medicine.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
