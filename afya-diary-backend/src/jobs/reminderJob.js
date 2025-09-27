const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const User = require('../models/User');
const smsService = require('../services/smsService');

cron.schedule('* * * * *', async () => {
  const now = new Date();
  const reminders = await Reminder.find({ status: 'pending', dueDate: { $lte: now } });

  for (const r of reminders) {
    const patient = await User.findById(r.patientId);
    if (!patient) continue;

    await smsService.sendSMS(
      patient.phone,
      r.message || 'Health reminder from AfyaDiary'
    );

    r.status = 'sent';
    await r.save();
  }

  if (reminders.length > 0) {
    console.log(`✅ Sent ${reminders.length} reminders at ${now}`);
  }
});
