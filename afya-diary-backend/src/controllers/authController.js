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

// Verify OTP and create/update user
exports.verifyOtp = async (req, res) => {
  try {
    const {
      phone,
      code,
      name,
      shaNumber,
      role,
      email,
      password,
      licenseNumber,
      pharmacyName,
      dob,
      gender,
    } = req.body;

    if (!phone || !code)
      return res.status(400).json({ message: 'Phone and code required' });

    const otp = await OTP.findOne({ phone, used: false }).sort({ createdAt: -1 });
    if (!otp) return res.status(400).json({ message: 'Invalid or expired code' });

    if (otp.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });
    if (otp.attempts >= OTP_MAX_ATTEMPTS)
      return res.status(429).json({ message: 'Too many attempts' });

    if (otp.code !== code) {
      otp.attempts = (otp.attempts || 0) + 1;
      await otp.save();
      return res.status(400).json({ message: 'Invalid code' });
    }

    otp.used = true;
    await otp.save();

    // ✅ First, find or create user
    let user = await User.findOne({ phone });

    if (!user) {
  // Create new user safely
  user = new User({
    phone,
    name,
    role: role || 'patient',
    email: email || undefined,
    dob: dob || undefined,
    gender: gender || 'other',
    ...(shaNumber ? { shaNumber } : {}),      // ✅ only include if not empty
    ...(licenseNumber ? { licenseNumber } : {}), // ✅ only include if present
    ...(pharmacyName ? { pharmacyName } : {}),   // ✅ same
  });

  if (password) {
    await user.setPassword(password);
  }

  


      await user.save();
    } else {
      // Update user
      if (shaNumber && !user.shaNumber) user.shaNumber = shaNumber;
      if (role && user.role !== role) user.role = role;
      if (email && !user.email) user.email = email;
      if (password && !user.passwordHash) await user.setPassword(password);
      if (licenseNumber && !user.licenseNumber) user.licenseNumber = licenseNumber;
      if (pharmacyName && !user.pharmacyName) user.pharmacyName = pharmacyName;
      if (dob && !user.dob) user.dob = dob;
      if (gender && !user.gender) user.gender = gender;
      if (name && !user.name) user.name = name;

      await user.save();
    }

    // ✅ Now we can safely create role-specific records
    if (user.role === 'patient') {
  const exists = await Patient.findOne({ userId: user._id });
  if (!exists) {
    await Patient.create({
      userId: user._id,
      phone: user.phone, // ✅ added
      name: user.name,   // ✅ added
      shaNumber: shaNumber || user.shaNumber,
      dob: dob || user.dob,
      gender: gender || user.gender,
    });
  }
}


    if (user.role === 'chemist') {
  const exists = await Chemist.findOne({ userId: user._id });
  if (!exists) {
    if (!licenseNumber) {
      console.error("❌ Missing licenseNumber for chemist:", req.body);
      return res.status(400).json({
        message: "License number is required for chemists.",
      });
    }

    await Chemist.create({
      userId: user._id,
      phone,
      licenseNumber,
      pharmacyName,
      email,
    });
  }
}


    if (user.role === 'chv') {
  const exists = await Chv.findOne({ userId: user._id });
  if (!exists) {
    await Chv.create({
      userId: user._id,
      name: user.name,
      phone: user.phone,
      shaNumber: user.shaNumber,
      password: user.passwordHash || password, // optional, depends on schema
      email: user.email || email,
    });
  }
}


    const token = signJwt({ userId: user._id, role: user.role }, '30d');
    const redirectTo = getRedirectByRole(user.role);

    return res.json({ token, user, redirectTo });
  } catch (err) {
    console.error('verifyOtp error:', err.message, err.stack);

    return res.status(500).json({ message: 'Server error' });
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

