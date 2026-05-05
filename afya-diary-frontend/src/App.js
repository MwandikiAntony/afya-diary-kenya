import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Public */
import Home        from "./pages/Home";
import Login       from "./pages/Login";
import Register    from "./pages/Register";
import Verify      from "./pages/Verify";
import About       from "./pages/About";
import Features    from "./pages/Features";
import Contact     from "./pages/Contact";
import Privacy     from "./pages/Privacy";
import Terms       from "./pages/Terms";
import { Security, Careers, FAQ, MobileApp, NotFound } from "./pages/PublicPages";

/* Patient */
import Dashboard      from "./pages/Dashboard";
import Patients       from "./pages/Patients";
import Appointments   from "./pages/Appointments";
import Records        from "./pages/Records";
import Reminders      from "./pages/Reminders";
import Profile        from "./pages/Profile";
import Notifications  from "./pages/Notifications";
import Prescriptions  from "./pages/Prescriptions";

/* Chemist */
import ChemistDashboard   from "./pages/chemist/ChemistDashboard";
import ChemistPatientPage from "./pages/chemist/ChemistPatientPage";
import ChemistInventory   from "./pages/chemist/ChemistInventory";
import ChemistProfile     from "./pages/chemist/ChemistProfile";
import ChemistScan        from "./pages/chemist/ChemistScan";
import AddMedicinePage    from "./pages/chemist/AddMedicinePage";
import AddPatientPage     from "./pages/chemist/AddPatientPage";
import DispensePage       from "./pages/chemist/DispensePage";
import AddRecord          from "./pages/chemist/AddRecord";
import AssignCHVPage      from "./pages/chemist/AssignCHVPage";

/* CHV */
import CHVDashboard from "./pages/chv/CHVDashboard";
import CHVPatients  from "./pages/chv/CHVPatients";
import CHVProfile   from "./pages/chv/CHVProfile";
import CHVReports   from "./pages/chv/CHVReports";

/* AI / Wellness */
import MentalHealthTips from "./components/AIHelper/MentalHealthTips";
import AIChat           from "./components/AIHelper/AIChat";
import MoodTracker      from "./components/AIHelper/MoodTracker";

/* Route guards */
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute    from "./components/PublicRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ── Public pages ── */}
        <Route path="/"            element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/login"       element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register"    element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/verify"      element={<PublicRoute><Verify /></PublicRoute>} />
        <Route path="/about"       element={<About />} />
        <Route path="/features"    element={<Features />} />
        <Route path="/contact"     element={<Contact />} />
        <Route path="/privacy"     element={<Privacy />} />
        <Route path="/terms"       element={<Terms />} />
        <Route path="/security"    element={<Security />} />
        <Route path="/careers"     element={<Careers />} />
        <Route path="/faq"         element={<FAQ />} />
        <Route path="/guides"      element={<FAQ />} />
        <Route path="/mobile-app"  element={<MobileApp />} />

        {/* ── Patient routes ── */}
        <Route path="/dashboard"    element={<ProtectedRoute role="patient"><Dashboard /></ProtectedRoute>} />
        <Route path="/patients"     element={<ProtectedRoute role="patient"><Patients /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute role="patient"><Appointments /></ProtectedRoute>} />
        <Route path="/records"      element={<ProtectedRoute role="patient"><Records /></ProtectedRoute>} />
        <Route path="/reminders"    element={<ProtectedRoute role="patient"><Reminders /></ProtectedRoute>} />
        <Route path="/notifications"element={<ProtectedRoute role="patient"><Notifications /></ProtectedRoute>} />
        <Route path="/prescriptions"element={<ProtectedRoute role="patient"><Prescriptions /></ProtectedRoute>} />
        <Route path="/profile"      element={<ProtectedRoute role="patient"><Profile /></ProtectedRoute>} />

        {/* ── Chemist routes ── */}
        <Route path="/chemist-dashboard"  element={<ProtectedRoute role="chemist"><ChemistDashboard /></ProtectedRoute>} />
        <Route path="/chemist-inventory"  element={<ProtectedRoute role="chemist"><ChemistInventory /></ProtectedRoute>} />
        <Route path="/chemist-profile"    element={<ProtectedRoute role="chemist"><ChemistProfile /></ProtectedRoute>} />
        <Route path="/chemist-scan"       element={<ProtectedRoute role="chemist"><ChemistScan /></ProtectedRoute>} />
        <Route path="/chemist/patient/:shaNumber"    element={<ChemistPatientPage />} />
        <Route path="/chemist/dispense/:shaNumber"   element={<DispensePage />} />
        <Route path="/chemist/dispense"              element={<ProtectedRoute role="chemist"><DispensePage /></ProtectedRoute>} />
        <Route path="/chemist/add-record/:shaNumber" element={<AddRecord />} />
        <Route path="/chemist/add-record"            element={<AddRecord />} />
        <Route path="/chemist/add-medicine"          element={<ProtectedRoute role="chemist"><AddMedicinePage /></ProtectedRoute>} />
        <Route path="/chemist/add-patient"           element={<AddPatientPage />} />
        <Route path="/chemist/assign-chv"            element={<ProtectedRoute role="chemist"><AssignCHVPage /></ProtectedRoute>} />

        {/* ── CHV routes ── */}
        <Route path="/chv-dashboard" element={<ProtectedRoute role="chv"><CHVDashboard /></ProtectedRoute>} />
        <Route path="/chv-patients"  element={<ProtectedRoute role="chv"><CHVPatients /></ProtectedRoute>} />
        <Route path="/chv-profile"   element={<ProtectedRoute role="chv"><CHVProfile /></ProtectedRoute>} />
        <Route path="/chv-reports"   element={<ProtectedRoute role="chv"><CHVReports /></ProtectedRoute>} />

        {/* ── Wellness / AI ── */}
        <Route path="/ai-chat"            element={<AIChat />} />
        <Route path="/mental-health/tips" element={<MentalHealthTips />} />
        <Route path="/mood-tracker"       element={<MoodTracker />} />

        {/* ── Fallback ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}