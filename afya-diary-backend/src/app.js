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



const patientRoutes = require('./routes/patientRoutes');
const reportRoutes = require('./routes/reportRoutes');



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
app.use("/api/chv", chvRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/records', healthRecordRoutes);
app.use('/api/chemist', chemistRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/patients', (req, res) => {
  // logic to return patients
});

app.get('/api/patients/assigned', (req, res) => {
  // logic to return assigned patients
});

app.get('/api/reports', (req, res) => {
  // logic to return reports
});
app.get("/api/chemist/medicines", (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  // Then fetch and send your data
  Medicine.find().then((medicines) => {
    res.status(200).json({ data: medicines });
  });
});


// Health check
app.get("/", (req, res) => {
  res.send("✅ Afya Diary API is running...");
});

module.exports = app;
