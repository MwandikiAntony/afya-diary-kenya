const Record = require("../models/Record");

// ✅ Add new record
exports.addRecord = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const record = await Record.create({
      patient: req.user._id, // logged-in user
      title,
      description,
      date,
    });

    res.status(201).json({ message: "Record added", record });
  } catch (err) {
    console.error("addRecord error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ View own records
exports.getMyRecords = async (req, res) => {
  try {
    const records = await Record.find({ patient: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ records });
  } catch (err) {
    console.error("getMyRecords error", err);
    res.status(500).json({ message: "Server error" });
  }
};
