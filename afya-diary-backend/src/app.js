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
const mentalHealthRoutes = require ('./routes/mentalHealthRoutes')


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
app.use("/api/mental-health", mentalHealthRoutes);
app.get('/api/patients', (req, res) => {
  // logic to return patients
});

app.get('/api/patients/assigned', (req, res) => {
  // logic to return assigned patients
});

app.get('/api/reports', (req, res) => {
  // logic to return reports
});



// Health check
app.get("/", (req, res) => {
  res.send("✅ Afya Diary API is running...");
});

module.exports = app;
