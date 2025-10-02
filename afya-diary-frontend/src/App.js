// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import CHVDashboard from "./pages/CHVDashboard";
import ChemistDashboard from "./pages/ChemistDashboard";

import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Records from "./pages/Records";
import Reminders from "./pages/Reminders";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Prescriptions from "./pages/Prescriptions";

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
          element={<ProtectedRoute role="chv"><CHVDashboard /></ProtectedRoute>}
        />

        {/* Chemist */}
        <Route
          path="/chemist-dashboard"
          element={<ProtectedRoute role="chemist"><ChemistDashboard /></ProtectedRoute>}
        />

        {/* fallback */}
<Route path="*" element={<PublicRoute><Home /></PublicRoute>} />

      </Routes>
    </Router>
  );
}
