Afya Diary Kenya

A digital health management platform connecting Patients, Community Health Volunteers (CHVs), and Chemists across Kenya.

Overview

Afya Diary Kenya is a digital healthcare system designed to streamline health record management and improve communication among patients, CHVs, and chemists.
Key capabilities include:

OTP-based authentication

Centralized personal health records

Medication and prescription tracking

CHV support workflows

Location-based access to nearby health providers

The platform is built using the MERN Stack with full role-based access.

Features
1. Authentication

OTP-based login (passwordless authentication)

JWT authentication with 30-day sessions

Automatic user account generation

Separate role-based dashboards:

Patient

CHV

Chemist

2. Patient Features

View and update health records

Symptom and health diary tracking

Medication management

Locate nearby CHVs and chemists

Receive CHV reminders and health tips

3. CHV Features

Manage assigned patients

Record visit details and follow-ups

Update vitals, symptoms, and notes

Monitor community-level health insights

4. Chemist Features

Dispense and manage medications

Access patient prescription history

Verify prescriptions

Support digital prescriptions

Tech Stack
Frontend

React.js

TailwindCSS

React Router

Axios

React Hot Toast

Context API

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

OTP service (via SMS Gateway)

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

2. Install Backend Dependencies
cd server
npm install

3. Configure Backend Environment Variables

Create a .env file inside the /server directory:

PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret
OTP_TTL_MIN=5
SMS_API_KEY=your-sms-provider-key

4. Install Frontend Dependencies
cd ../client
npm install

5. Run the Application
Backend
npm run dev

Frontend
npm start

API Endpoints
Authentication Endpoints
METHOD	ENDPOINT	DESCRIPTION
POST	/auth/request-otp	Generate and send OTP
POST	/auth/verify-otp	Verify OTP and log in
POST	/auth/resend-otp	Resend a new OTP
GET	/auth/me	Fetch authenticated user data
User Roles & Access
Role	Access Permissions
Patient	Health diary, medication list, CHV lookup
CHV	Patient management, record community visits
Chemist	Dispense drugs, view medication history
Development Status

OTP login — Complete

Role-based dashboards — Complete

User onboarding — Complete

SMS Integration — Complete

Patient diary — In progress

CHV Management module — Coming soon

Chemist Prescription module — Coming soon

Author

Antony Mwandiki
Software Developer — Kenya

GitHub: https://github.com/MwandikiAntony

LinkedIn: https://www.linkedin.com/in/antony-mwandiki-36a788255

Support

For inquiries or collaboration:

Email: antonymwandiki@gmail.com

Phone: +2547XXXXXXXX
