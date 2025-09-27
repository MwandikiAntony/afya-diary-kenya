const User = require("../models/User");

// Register user (dummy for now, since we use OTP flow too)
exports.registerUser = async (req, res) => {
  try {
    const { phone, name } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    let user = await User.findOne({ phone });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = await User.create({ phone, name });

    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login (dummy for now)
exports.loginUser = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("loginUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get profile (protected)
exports.getProfile = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile (protected)
exports.updateProfile = async (req, res) => {
  try {
    const { name, dob, gender } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (dob) user.dob = dob;
    if (gender) user.gender = gender;

    await user.save();

    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
