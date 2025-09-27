// src/controllers/authController.js
const OTP = require('../models/OTP');
const User = require('../models/User');
const smsService = require('../services/smsService');
const jwt = require('jsonwebtoken');

const OTP_TTL_MIN = parseInt(process.env.OTP_TTL_MIN || '5', 10); // minutes
const OTP_MAX_ATTEMPTS = 5;

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function signJwt(payload, expires = '30d') {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expires });
}

exports.requestOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'phone is required' });

    // generate code and store
    const code = generateCode();
    const expiresAt = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);

    await OTP.create({ phone, code, expiresAt });

    // send SMS (best-effort)
    const smsText = `AfyaDiary OTP: ${code}. Expires in ${OTP_TTL_MIN} minutes.`;
    try {
      await smsService.sendSMS(phone, smsText);
    } catch (smsErr) {
      console.error('SMS send failed', smsErr);
      // still return ok so client can try again; dev will log code in console via smsService
    }

    return res.json({ ok: true, message: 'OTP sent if phone is valid' });
  } catch (err) {
    console.error('requestOtp error', err);
    return res.status(500).json({ message: 'server error' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, code, name, shaNumber } = req.body;
    if (!phone || !code) return res.status(400).json({ message: 'phone and code required' });

    // find latest unused OTP
    const otp = await OTP.findOne({ phone, used: false }).sort({ createdAt: -1 });
    if (!otp) return res.status(400).json({ message: 'Invalid or expired code' });

    if (otp.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({ message: 'Too many attempts' });
    }

    if (otp.code !== code) {
      otp.attempts = (otp.attempts || 0) + 1;
      await otp.save();
      return res.status(400).json({ message: 'Invalid code' });
    }

    // mark used
    otp.used = true;
    await otp.save();

    // find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, name, shaNumber });
    } else {
      // attach SHA if provided and not set
      if (shaNumber && !user.shaNumber) {
        user.shaNumber = shaNumber;
        await user.save();
      }
    }

    const token = signJwt({ userId: user._id, role: user.role }, '30d');

    return res.json({ token, user });
  } catch (err) {
    console.error('verifyOtp error', err);
    return res.status(500).json({ message: 'server error' });
  }
};

// optional: allow patient to set a PIN for quick local auth (not required)
exports.setPin = async (req, res) => {
  try {
    const { pin } = req.body;
    const user = req.user;
    if (!pin || pin.length < 4) return res.status(400).json({ message: 'PIN must be at least 4 characters' });

    await user.setPassword(pin);
    await user.save();
    return res.json({ ok: true, message: 'PIN saved' });
  } catch (err) {
    console.error('setPin error', err);
    return res.status(500).json({ message: 'server error' });
  }
};

// optional: login with PIN
exports.loginWithPin = async (req, res) => {
  try {
    const { phone, pin } = req.body;
    if (!phone || !pin) return res.status(400).json({ message: 'phone and pin required' });

    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await user.validatePassword(pin);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signJwt({ userId: user._id, role: user.role }, '30d');
    return res.json({ token, user });
  } catch (err) {
    console.error('loginWithPin error', err);
    return res.status(500).json({ message: 'server error' });
  }
};
