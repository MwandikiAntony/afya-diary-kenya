// src/services/smsService.js
const Africastalking = require('africastalking');

const africastalking = Africastalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

const sms = africastalking.SMS;

async function sendSMS(phone, message) {
  try {
    const res = await sms.send({
      to: [phone],   // array of numbers
      message,
      from: 'AfyaDiary', // optional sender ID
    });
    console.log('SMS sent:', res);
    return res;
  } catch (err) {
    console.error('SMS send failed:', err);
    throw err;
  }
}

module.exports = { sendSMS };
