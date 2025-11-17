Afya Diary Kenya — README
 Overview

Afya Diary Kenya is a health management platform designed to connect Patients, CHVs (Community Health Volunteers), and Chemists within a unified digital ecosystem.
The platform enables users to register using OTP-based authentication, manage their personal health records, access nearby CHVs and chemists, track medical data, and improve healthcare accessibility across Kenya.

Afya Diary Kenya is built using the MERN Stack (MongoDB, Express.js, React.js, Node.js) with a fully role-based login experience.

 Features
 Authentication

OTP-based login (no passwords needed)

Role-based access:

Patient Dashboard

CHV Dashboard

Chemist Dashboard

Secure JWT tokens with 30-day session handling

Automatic user creation on first login

 Patient Features

View and update personal health records

Manage medications

Access nearby CHVs and chemists

Health diary & symptom tracking

Receive CHV guidance and reminders

 CHV Features

Manage assigned patients

Update patient health visits

Record vitals, symptoms & follow-ups

Track community health progress

 Chemist Features

Manage medicines dispensed

Provide patient medication history

Verify prescriptions

Support for digital prescriptions

 Tech Stack
Frontend

React.js

TailwindCSS

Axios

React Router

React Hot Toast

Context API for global authentication

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

OTP service using SMS Gateway

Role-based authorization middleware

 Project Structure (Summary)
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

Backend Environment Variables

Create a .env file with:

PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret
OTP_TTL_MIN=5
SMS_API_KEY=your-sms-provider-key

3. Install Frontend Dependencies
cd ../client
npm install

4. Run the Application
Backend
npm run dev

Frontend
npm start

 API Endpoints (Auth)
METHOD	ENDPOINT	DESCRIPTION
POST	/auth/request-otp	Generates & sends OTP to phone
POST	/auth/verify-otp	Verifies OTP & logs in user
POST	/auth/resend-otp	Sends a new OTP
GET	/auth/me	Fetch logged-in user details
 User Roles & Access
Role	Access
Patient	Health diary, CHV lookup, medication list
CHV	Manage patients, record community visits
Chemist	Dispense drugs, view medication history
 Development Status

OTP login ️

Role-based dashboards 

User onboarding 

SMS Integration 

Patient diary 

CHV management module

Chemist prescription module 

🧑‍💻 Author

Antony Mwandiki
Software Developer — Kenya
GitHub: https://github.com/MwandikiAntony

LinkedIn: https://www.linkedin.com/in/antony-mwandiki-36a788255

📞 Support

For inquiries or collaboration:
📧 Email: antonymwandiki26@gmail.com

📱 Phone: +254702224523
