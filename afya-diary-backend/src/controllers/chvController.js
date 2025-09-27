const CHV = require("../models/CHV");
const Reminder = require("../models/Reminder");

// ✅ Assign patients to a CHV
exports.assignPatients = async (req, res) => {
  try {
    const { patientIds } = req.body;

    let chv = await CHV.findOne({ user: req.user._id });
    if (!chv) {
      chv = await CHV.create({ user: req.user._id, assignedPatients: [] });
    }

    chv.assignedPatients.push(...patientIds);
    await chv.save();

    res.json({ message: "Patients assigned successfully", chv });
  } catch (err) {
    console.error("assignPatients error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Create a reminder
exports.createReminder = async (req, res) => {
  try {
    const { patientId, message, remindAt } = req.body;

    const chv = await CHV.findOne({ user: req.user._id });
    if (!chv) {
      return res.status(403).json({ message: "You are not a CHV" });
    }

    const reminder = await Reminder.create({
      patient: patientId,
      chv: chv._id,
      message,
      remindAt,
    });

    res.status(201).json({ message: "Reminder created", reminder });
  } catch (err) {
    console.error("createReminder error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ View reminders
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ chv: req.user._id })
      .populate("patient", "phone")
      .sort({ remindAt: 1 });

    res.json({ reminders });
  } catch (err) {
    console.error("getReminders error", err);
    res.status(500).json({ message: "Server error" });
  }
};
