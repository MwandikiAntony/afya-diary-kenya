const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

const PORT = process.env.PORT || 5000;

// Import cron jobs (must be after dotenv & before server start)
require("./cron/reminderCron");

// Connect DB then start server
