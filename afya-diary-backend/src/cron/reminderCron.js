const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const User = require('../models/User');
const smsService = require('../services/smsService');

cron.schedule('* * * * *', async () => { // runs every minute
  try {
    const now = new Date();
    const reminders = await Reminder.find({ sent: false, dueDate: { $lte: now } });

    for (const r of reminders) {
      const patient = await User.findById(r.patientId);
      if (!patient) continue;

      try {
        await smsService.sendSMS(patient.phone, r.message);
        r.sent = true;
        await r.save();
      } catch (smsErr) {
        console.error('Failed to send SMS for reminder', r._id, smsErr);
      }
    }
  } catch (err) {
    console.error('Reminder cron error:', err);
  }
});
