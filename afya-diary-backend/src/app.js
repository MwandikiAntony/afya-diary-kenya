const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const recordRoutes = require("./routes/recordRoutes");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const chvRoutes = require("./routes/chvRoutes");
const reminderRoutes = require('./routes/reminderRoutes');
const healthRecordRoutes = require('./routes/healthRecordRoutes');
const chemistRoutes = require('./routes/chemistRoutes');




const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);   // OTP auth, login-pin, etc.
app.use("/api/users", userRoutes); // profile & user management
app.use("/api/records", recordRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/chvs", chvRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/records', healthRecordRoutes);
app.use('/api/chemist', chemistRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("✅ Afya Diary API is running...");
});

module.exports = app;
