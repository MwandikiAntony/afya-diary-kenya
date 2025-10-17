const MentalHealth = require("../models/MentalHealth");

// Log mood
exports.logMood = async (req, res) => {
  const { userId, mood, notes } = req.body;
  if (!userId || !mood) {
    return res.status(400).json({ message: "userId and mood are required" });
  }
  try {
    const entry = new MentalHealth({ userId, mood, notes });
    await entry.save();
    res.status(201).json({ message: "Mood logged successfully", entry });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get user mood history
exports.getMoodHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    const entries = await MentalHealth.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
