# Afya Diary Kenya

A digital health management platform connecting Patients, Community Health Volunteers (CHVs), and Chemists across Kenya.

---
## Live Demo

[![Frontend](https://img.shields.io/badge/Frontend-Live-brightgreen)](https://afya-diary-kenya.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-API-blue)](https://afya-diary-kenya.onrender.com)

---
## Overview

Afya Diary Kenya is a digital healthcare system designed to streamline health record management and improve communication among patients, CHVs, and chemists. Key capabilities include:

- OTP-based authentication
- Centralized personal health records
- Medication and prescription tracking
- CHV support workflows
- Location-based access to nearby health providers

The platform is built using the **MERN Stack** with full role-based access.

---

## Features

### Authentication
- OTP-based login (passwordless authentication)
- JWT authentication with 30-day sessions
- Automatic user account generation
- Separate role-based dashboards:
  - **Patient**
  - **CHV**
  - **Chemist**

### Patient Features
- View and update health records
- Symptom and health diary tracking
- Medication management
- Locate nearby CHVs and chemists
- Receive CHV reminders and health tips

### CHV Features
- Manage assigned patients
- Record visit details and follow-ups
- Update vitals, symptoms, and notes
- Monitor community-level health insights

### Chemist Features
- Dispense and manage medications
- Access patient prescription history
- Verify prescriptions
- Support digital prescriptions

---

## Tech Stack

### Frontend
- React.js
- TailwindCSS
- React Router
- Axios
- React Hot Toast
- Context API

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- OTP service (via SMS Gateway)
- Role-based authorization middleware

---

## Project Structure

```text
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
```
### 1. Installation & Setup
Clone the repository

````
git clone https://github.com/MwandikiAntony/afya-diary-kenya.git
cd afya-diary-kenya
````

### 2. Install backend dependencies
````
cd server
npm install
Configure backend environment variables
````
### 3. Create a .env file inside the /server directory:

env
```
PORT=5000
MONGO_URI=mongodb+srv://<your-mongodb-uri>
JWT_SECRET=your-secret
OTP_TTL_MIN=5
SMS_API_KEY=your-sms-provider-key
```
### 4. Install frontend dependencies

```
cd ../client
npm install
````
### 5. Run the application


Backend
````
cd ../server
npm run dev
````
Frontend
````
cd ../client
npm start
````

## API Endpoints
Method	Endpoint	Description
1. POST	/auth/request-otp	Generate and send OTP
2. POST	/auth/verify-otp	Verify OTP and log in
3. POST	/auth/resend-otp	Resend a new OTP
4. GET	/auth/me	Fetch authenticated user data

## User Roles & Access
Role	Access Permissions
1. Patient	Health diary, medication list, CHV lookup
2. CHV	Patient management, record community visits
3. Chemist	Dispense drugs, view medication history

## Development Status
OTP login — Complete

Role-based dashboards — Complete

User onboarding — Complete

SMS Integration — Complete

Patient diary — Complete

CHV Management module — Complete

Chemist Prescription module — Complete

## Author
Antony Mwandiki — Software Developer, Kenya

GitHub: https://github.com/MwandikiAntony

LinkedIn: https://www.linkedin.com/in/antony-mwandiki-36a788255

## Support
For inquiries or collaboration:

Email: antonymwandiki26@gmail.com

Phone: +254702224523
