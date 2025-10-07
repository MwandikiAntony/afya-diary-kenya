const OTP = require('../models/OTP');
const User = require('../models/User');
const smsService = require('../services/smsService');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // <-- make sure this exists
const sendOtp = require('../utils/sendOtp'); 

const OTP_TTL_MIN = parseInt(process.env.OTP_TTL_MIN || '5', 10); // minutes
const OTP_MAX_ATTEMPTS = 5;

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function signJwt(payload, expires = '30d') {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expires });
}

function getRedirectByRole(role) {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'doctor': return '/doctor/dashboard';
    case 'patient': return '/patient/dashboard';
    default: return '/';
  }
}

exports.requestOtp = async (req, res) => {
  try {
    const { phone, role = 'patient' } = req.body; // get role, default to 'patient'
    if (!phone) return res.status(400).json({ message: 'phone is required' });

    // generate OTP code
    const code = generateCode();

    // create OTP with role included
    await OTP.create({
      phone,
      code,
      expiresAt: new Date(Date.now() + OTP_TTL_MIN * 60 * 1000), // expires in OTP_TTL_MIN minutes
      used: false,
      attempts: 0,
      role, // save role here
    });

    // send SMS (best-effort)
    const smsText = `AfyaDiary OTP: ${code}. Expires in ${OTP_TTL_MIN} minutes.`;
    try {
      await smsService.sendSMS(phone, smsText);
    } catch (smsErr) {
      console.error('SMS send failed', smsErr);
    }

    return res.json({ ok: true, message: 'OTP sent if phone is valid' });
  } catch (err) {
    console.error('requestOtp error', err);
    return res.status(500).json({ message: 'server error' });
  }
};


exports.verifyOtp = async (req, res) => {
  try {
    const { phone, code, name, shaNumber, role } = req.body;  // <-- get role from client

    if (!phone || !code) return res.status(400).json({ message: 'phone and code required' });

    // find latest unused OTP for phone
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

    // mark OTP as used
    otp.used = true;
    await otp.save();

    // find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, name, shaNumber, role: role || 'patient' });
    } else {
      // update shaNumber if provided and not set
      if (shaNumber && !user.shaNumber) {
        user.shaNumber = shaNumber;
      }
      // update role if provided and different (optional)
      if (role && user.role !== role) {
        user.role = role;
      }
      await user.save();
    }

    // sign JWT with userId and role
    const token = signJwt({ userId: user._id, role: user.role }, '30d');

    // determine redirect URL based on role
    const redirectTo = getRedirectByRole(user.role);

    return res.json({ token, user, redirectTo });
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

//resend OTP

exports.resendOtp = async (req, res) => {
  try {
    const { phone, role } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // generate a new 6-digit code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // store/update OTP in DB
    await db.query(
      "UPDATE users SET otp = $1, otp_expires_at = NOW() + INTERVAL '10 minutes' WHERE phone = $2",
      [otp, phone]
    );

    // send OTP via SMS
    await sendOtp(phone, otp);

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error("resendOtp error:", err);
    return res.status(500).json({ message: "Failed to resend OTP" });
  }
};




