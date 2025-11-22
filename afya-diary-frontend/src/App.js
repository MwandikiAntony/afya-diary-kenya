// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import Register from "./pages/Register";
import ChemistPatientPage from "./pages/chemist/ChemistPatientPage";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Records from "./pages/Records";
import Reminders from "./pages/Reminders";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import ChemistDashboard from "./pages/chemist/ChemistDashboard";
import ChemistInventory from "./pages/chemist/ChemistInventory";
import ChemistProfile from "./pages/chemist/ChemistProfile";
import CHVDashboard from "./pages/chv/CHVDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Prescriptions from "./pages/Prescriptions";
import ChemistScan from "./pages/chemist/ChemistScan";
import CHVPatients from "./pages/chv/CHVPatients";
import CHVProfile from "./pages/chv/CHVProfile";
import CHVReports from "./pages/chv/CHVReports";
import AddRecord from "./pages/chemist/AddRecord"
import AddMedicinePage from "./pages/chemist/AddMedicinePage";
import AddPatientPage from "./pages/chemist/AddPatientPage";
import DispensePage from "./pages/chemist/DispensePage";
import MentalHealthTips from "./components/AIHelper/MentalHealthTips";
import AIChat from "./components/AIHelper/AIChat";
import MoodTracker from "./components/AIHelper/MoodTracker";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/verify" element={<PublicRoute><Verify /></PublicRoute>} />

        {/* Patient */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute role="patient"><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/patients"
          element={<ProtectedRoute role="patient"><Patients /></ProtectedRoute>}
        />
        <Route
          path="/appointments"
          element={<ProtectedRoute role="patient"><Appointments /></ProtectedRoute>}
        />
        <Route
          path="/records"
          element={<ProtectedRoute role="patient"><Records /></ProtectedRoute>}
        />
        <Route
          path="/reminders"
          element={<ProtectedRoute role="patient"><Reminders /></ProtectedRoute>}
        />
                <Route
          path="/notifications"
          element={<ProtectedRoute role="patient"><Notifications /></ProtectedRoute>}
        />
        <Route
          path="/prescriptions"
          element={<ProtectedRoute role="patient"><Prescriptions /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute role="patient"><Profile /></ProtectedRoute>}
        />

        {/* CHV */}
        <Route
          path="/chv-dashboard"
          element= {<CHVDashboard />}
        />
        <Route
        path="/chv-patients"
        element={<ProtectedRoute role="chv"><CHVPatients/></ProtectedRoute>} />
        <Route 
        path="/chv-profile"
        element={<ProtectedRoute role="chv"><CHVProfile/></ProtectedRoute>} />
        <Route path="chv-reports"
        element={<ProtectedRoute role="chv"><CHVReports/></ProtectedRoute>} />

        {/* Chemist */}
        <Route
          path="/chemist-dashboard"
          element={<ProtectedRoute role="chemist"><ChemistDashboard /></ProtectedRoute>}
        />
        <Route path="/chemist-scan"
        element={<ProtectedRoute role="chemist"><ChemistScan/></ProtectedRoute>}
        />
        <Route path="/chemist-profile"
        element={<ProtectedRoute role="chemist"><ChemistProfile/></ProtectedRoute>} />
        <Route path="/chemist-inventory"
        element={<ProtectedRoute role="chemist"><ChemistInventory/></ProtectedRoute>} />

        <Route path="/chemist/patient/:shaNumber" element={<ChemistPatientPage />} />
        <Route path="/chemist/dispense/:shaNumber" element={<DispensePage />} />
        <Route path="/chemist/add-record/:shaNumber" element={<AddRecord />} />
        <Route path="/chemist/add-record" element={<AddRecord />} />
        <Route path="/chemist/dispense" element={<ProtectedRoute role="chemist"><DispensePage/></ProtectedRoute>}/>
        <Route path="/chemist/add-medicine" element={<ProtectedRoute role="chemist"> <AddMedicinePage/></ProtectedRoute>} />
        <Route path= "/chemist/add-patient"
  element= {<AddPatientPage/>} />,

      <Route path="/ai-helper" element={<AIChat />} />
      <Route path="/ai-chat" element={<AIChat />} />
      <Route path="/mental-health/tips" element={<MentalHealthTips />} />
    <Route path="/mood-tracker" element={<MoodTracker />} />




        {/* fallback */}
<Route path="*" element={<PublicRoute><Home /></PublicRoute>} />

      </Routes>
    </Router>
  );
}
