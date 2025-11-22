// controllers/authController.js
const OTP = require('../models/OTP');
const User = require('../models/User');
const smsService = require('../services/smsService');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Chemist = require('../models/Chemist');
const Chv = require('../models/CHV');

const OTP_TTL_MIN = parseInt(process.env.OTP_TTL_MIN || '5', 10); // minutes
const OTP_MAX_ATTEMPTS = 5;

// Generate 6-digit OTP
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Sign JWT
function signJwt(payload, expires = '30d') {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expires });
}

// Redirect based on role
function getRedirectByRole(role) {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'doctor': return '/doctor/dashboard';
    case 'patient': return '/patient/dashboard';
    default: return '/';
  }
}

// Request OTP
exports.requestOtp = async (req, res) => {
  try {
    const { phone, role = 'patient' } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone is required' });

    const code = generateCode();

    await OTP.create({
      phone,
      code,
      expiresAt: new Date(Date.now() + OTP_TTL_MIN * 60 * 1000),
      used: false,
      attempts: 0,
      role,
    });

    const smsText = `AfyaDiary OTP: ${code}. Expires in ${OTP_TTL_MIN} minutes.`;
    try {
      await smsService.sendSMS(phone, smsText);
    } catch (err) {
      console.error('SMS send failed', err);
    }

    return res.json({ ok: true, message: 'OTP sent if phone is valid' });
  } catch (err) {
    console.error('requestOtp error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Verify OTP for LOGIN (existing users only)
exports.verifyLoginOtp = async (req, res) => {
  try {
    const { phone, code, role } = req.body;

    if (!phone || !code)
      return res.status(400).json({ message: "Phone and code required" });

    const otp = await OTP.findOne({ phone, used: false }).sort({ createdAt: -1 });
    if (!otp) return res.status(400).json({ message: "Invalid or expired code" });

    if (otp.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    if (otp.attempts >= OTP_MAX_ATTEMPTS)
      return res.status(429).json({ message: "Too many attempts" });

    if (otp.code !== code) {
      otp.attempts = (otp.attempts || 0) + 1;
      await otp.save();
      return res.status(400).json({ message: "Invalid code" });
    }

    otp.used = true;
    await otp.save();

    // LOGIN: only allow existing users
    const user = await User.findOne({ phone, role });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found. Please register first." });
    }

    if (role && user.role !== role) {
      return res.status(403).json({
        message: `Access denied. You are registered as a ${user.role}. Please log in using the correct role.`,
      });
    }

    const token = signJwt({ userId: user._id, role: user.role }, "30d");
    const redirectTo = getRedirectByRole(user.role);

    return res.json({ token, user, redirectTo });
  } catch (err) {
    console.error("verifyLoginOtp error:", err.message, err.stack);
    return res.status(500).json({ message: "Server error" });
  }
};


// Verify OTP for REGISTRATION (creates new user)
exports.verifyRegistrationOtp = async (req, res) => {
  try {
    const {
      phone,
      code,
      name,
      role,
      email,
      password,
      shaNumber,
      licenseNumber,
      pharmacyName,
      dob,
      gender,
    } = req.body;

    if (!phone || !code || !name)
      return res.status(400).json({ message: "Phone, code, and name are required" });

    const otp = await OTP.findOne({ phone, used: false }).sort({ createdAt: -1 });
    if (!otp) return res.status(400).json({ message: "Invalid or expired code" });

    if (otp.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    if (otp.attempts >= OTP_MAX_ATTEMPTS)
      return res.status(429).json({ message: "Too many attempts" });

    if (otp.code !== code) {
      otp.attempts = (otp.attempts || 0) + 1;
      await otp.save();
      return res.status(400).json({ message: "Invalid code" });
    }

    otp.used = true;
    await otp.save();

    // REGISTRATION: create user if not exists
    let user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ message: "User already exists. Please login." });
    }

    user = new User({
      phone,
      name,
      role: role || "patient",
      email: email || undefined,
      dob: dob || undefined,
      gender: gender || "other",
      ...(shaNumber ? { shaNumber } : {}),
      ...(licenseNumber ? { licenseNumber } : {}),
      ...(pharmacyName ? { pharmacyName } : {}),
    });

    if (password) await user.setPassword(password);
    await user.save();

    // Create role-specific records safely
    if (user.role === "patient") {
      await Patient.create({
        userId: user._id,
        phone: user.phone,
        name: user.name,
        shaNumber: shaNumber || user.shaNumber,
        dob: dob || user.dob,
        gender: gender || user.gender,
      });
    }

    if (user.role === "chemist") {
      if (!licenseNumber)
        return res.status(400).json({ message: "License number is required for chemists." });

      await Chemist.create({
        userId: user._id,
        phone,
        licenseNumber,
        pharmacyName,
        email,
      });
    }

    if (user.role === "chv") {
      await Chv.create({
        userId: user._id,
        name: user.name,
        phone: user.phone,
        shaNumber: user.shaNumber,
        password: user.passwordHash || password,
        email: user.email || email,
      });
    }

    const token = signJwt({ userId: user._id, role: user.role }, "30d");
    const redirectTo = getRedirectByRole(user.role);

    return res.json({ token, user, redirectTo });
  } catch (err) {
    console.error("verifyRegistrationOtp error:", err.message, err.stack);
    return res.status(500).json({ message: "Server error" });
  }
};




// Optional: Set PIN for CHV / Chemist
exports.setPin = async (req, res) => {
  try {
    const { pin } = req.body;
    const user = req.user;
    if (!pin || pin.length < 4) return res.status(400).json({ message: 'PIN must be at least 4 characters' });

    await user.setPassword(pin);
    await user.save();
    // After user.save()
    return res.json({ ok: true, message: 'PIN saved' });
  } catch (err) {
    console.error('setPin error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Login with PIN
exports.loginWithPin = async (req, res) => {
  try {
    const { phone, pin } = req.body;
    if (!phone || !pin) return res.status(400).json({ message: 'Phone and PIN required' });

    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await user.validatePassword(pin);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signJwt({ userId: user._id, role: user.role }, '30d');
    return res.json({ token, user });
  } catch (err) {
    console.error('loginWithPin error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Resend OTP
exports.resendOtp = async (req, res) => {
  try {
    const { phone, role = 'patient' } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // generate a new OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // save OTP in DB
    await OTP.create({
      phone,
      code,
      expiresAt: new Date(Date.now() + OTP_TTL_MIN * 60 * 1000),
      used: false,
      attempts: 0,
      role, // role sent from frontend
    });

    // send OTP via SMS
    try {
      await smsService.sendSMS(phone, `AfyaDiary OTP: ${code}. Expires in ${OTP_TTL_MIN} minutes.`);
    } catch (smsErr) {
      console.error("SMS send failed", smsErr);
    }

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error("resendOtp error:", err);
    return res.status(500).json({ message: "Failed to resend OTP", error: err.message });
  }
};

