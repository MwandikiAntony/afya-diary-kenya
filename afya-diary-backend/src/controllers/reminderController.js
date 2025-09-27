const Reminder = require('../models/Reminder');
const User = require('../models/User');

// ✅ CHV creates a reminder for a patient
const smsService = require('../services/smsService');

exports.createReminder = async (req, res) => {
  try {
    const { patientId, message, dueDate } = req.body;
    if (!patientId || !message || !dueDate) {
      return res.status(400).json({ message: 'patientId, message, and dueDate are required' });
    }

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const reminder = await Reminder.create({
      patientId,
      creatorId: req.user._id,
      message,
      dueDate,
    });

    // If due date is within the next 5 minutes, send SMS immediately
    const now = new Date();
    const due = new Date(dueDate);
    const diffMinutes = (due - now) / 1000 / 60;

    if (diffMinutes <= 5) {
      try {
        await smsService.sendSMS(patient.phone, message);
        reminder.sent = true;
        await reminder.save();
        console.log(`SMS sent immediately for reminder ${reminder._id}`);
      } catch (smsErr) {
        console.error('Immediate SMS send failed', smsErr);
      }
    }

    res.status(201).json(reminder);
  } catch (err) {
    console.error('createReminder error', err);
    res.status(500).json({ message: 'Server error' });
  }
};



// ✅ Get reminders created by this CHV
// src/controllers/reminderController.js
exports.getMyReminders = async (req, res) => {
  try {
    let reminders;

    if (req.user.role === 'patient') {
      // patients see reminders assigned to them
      reminders = await Reminder.find({ patientId: req.user._id })
        .populate('patientId', 'name phone')
        .populate('chvId', 'name phone');
    } else {
      // CHV and chemist see reminders they created
      reminders = await Reminder.find({ creatorId: req.user._id })
        .populate('patientId', 'name phone')
        .populate('chvId', 'name phone');
    }

    res.json(reminders);
  } catch (err) {
    console.error('getMyReminders error', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// ✅ Update a reminder
exports.updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findOne({ _id: id, chvId: req.user._id });

    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

    Object.assign(reminder, req.body);
    await reminder.save();

    res.json(reminder);
  } catch (err) {
    console.error('updateReminder error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Delete a reminder
exports.deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findOneAndDelete({ _id: id, chvId: req.user._id });

    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

    res.json({ message: 'Reminder deleted' });
  } catch (err) {
    console.error('deleteReminder error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//Get upcoming reminder
// Get upcoming reminders for a user
exports.getUpcomingReminders = async (req, res) => {
  try {
    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours ahead

    let reminders;

    if (req.user.role === 'patient') {
      // Patient sees reminders assigned to them
      reminders = await Reminder.find({
        patientId: req.user._id,
        dueDate: { $gte: now, $lte: next24h },
      }).sort({ dueDate: 1 });
    } else {
      // CHV or chemist sees reminders they created within next 24h
      reminders = await Reminder.find({
        creatorId: req.user._id,
        dueDate: { $gte: now, $lte: next24h },
      }).sort({ dueDate: 1 });
    }

    res.json(reminders);
  } catch (err) {
    console.error('getUpcomingReminders error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get overdue reminders for a user
exports.getOverdueReminders = async (req, res) => {
  try {
    const now = new Date();

    let reminders;

    if (req.user.role === 'patient') {
      // Patient sees reminders assigned to them that are overdue
      reminders = await Reminder.find({
        patientId: req.user._id,
        dueDate: { $lt: now },
        sent: false, // only not yet sent
      }).sort({ dueDate: 1 });
    } else {
      // CHV or chemist sees reminders they created that are overdue
      reminders = await Reminder.find({
        creatorId: req.user._id,
        dueDate: { $lt: now },
        sent: false,
      }).sort({ dueDate: 1 });
    }

    res.json(reminders);
  } catch (err) {
    console.error('getOverdueReminders error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

