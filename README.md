Afya Diary Kenya

A digital health management platform connecting Patients, Community Health Volunteers (CHVs), and Chemists across Kenya.

Table of Contents

Overview

Features

Tech Stack

Project Structure

Installation & Setup

API Endpoints

User Roles & Access

Development Status

Author

Support

Overview

Afya Diary Kenya is a digital healthcare system built to streamline communication and health record management between patients, CHVs, and chemists.
It provides:

OTP-based registration and authentication

Centralized health records

CHV-driven community support

Medication and prescription tracking

Geo-based access to nearby health providers

The system is powered by the MERN Stack with fully role-based dashboards.

Features
Authentication

OTP-based login (no passwords)

Secure JWT authentication with 30-day sessions

Automatic user creation on first login

Role-based access system:

Patient dashboard

CHV dashboard

Chemist dashboard

Patient Features

Manage personal health records

Track symptoms and health diary

View nearby CHVs and chemists

Manage medication lists

Receive reminders and CHV guidance

CHV Features

Manage assigned patients

Record health visits and follow-ups

Update vitals, symptoms, and notes

Monitor community health patterns

Chemist Features

Manage dispensed medications

Access patient medication history

Verify prescriptions

Support for digital prescriptions

Tech Stack
Frontend

React.js

TailwindCSS

Axios

React Router

React Hot Toast

Context API

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

OTP service via SMS Gateway

Role-based authorization middleware

Project Structure
/client
  ├── src
  │   ├── pages
  │   │   ├── Login.js
  │   │   ├── VerifyOTP.js
  │   │   ├── Dashboard.js
  │   │   ├── CHVDashboard.js
  │   │   └── ChemistDashboard.js
  │   ├── components
  │   ├── context
  │   ├── utils
  │   └── App.js

/server
  ├── controllers
  │   └── authController.js
  ├── models
  │   ├── OTP.js
  │   └── User.js
  ├── routes
  │   └── authRoutes.js
  ├── config
  │   └── db.js
  └── server.js

Installation & Setup
1. Clone the Repository
git clone https://github.com/<your-username>/afya-diary-kenya.git
cd afya-diary-kenya

2. Backend Setup
cd server
npm install


Create a .env file:

PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret
OTP_TTL_MIN=5
SMS_API_KEY=your-sms-provider-key

3. Frontend Setup
cd ../client
npm install

4. Run the Application

Backend:

npm run dev


Frontend:

npm start

API Endpoints
Authentication Endpoints
METHOD	ENDPOINT	DESCRIPTION
POST	/auth/request-otp	Generate and send OTP
POST	/auth/verify-otp	Verify OTP and log in
POST	/auth/resend-otp	Resend OTP
GET	/auth/me	Get current user information
User Roles & Access
Role	Permissions
Patient	Diary, CHV lookup, medication list
CHV	Manage patients, record visits
Chemist	Dispense drugs, medication history
Development Status
Feature	Status
OTP login	Completed
Role-based dashboards	Completed
User onboarding	Completed
SMS integration	Completed
Patient diary	In progress
CHV management module	Coming soon
Chemist prescription module	Coming soon
Author

Antony Mwandiki
Software Developer — Kenya

GitHub: https://github.com/MwandikiAntony

LinkedIn: https://www.linkedin.com/in/antony-mwandiki-36a788255

Support

For inquiries or collaborations:

Email: antonymwandiki26@gmail.com

Phone: +254702224523
