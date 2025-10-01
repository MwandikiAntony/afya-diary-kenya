// src/pages/CHVDashboard.js
import React from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

export default function CHVDashboard() {
  // replace with real API data later
  const patients = [
    { id: "p1", name: "John Doe", phone: "+254712345678", lastVisit: "2025-09-20" },
    { id: "p2", name: "Jane Wanjiku", phone: "+254723456789", lastVisit: "2025-09-15" },
  ];

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-3xl font-bold text-[#00695C] mb-4">👩‍⚕️ CHV Dashboard</h1>
        <div className="mb-6">
          <Link to="/patients/new" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">➕ Add Patient</Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {patients.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-gray-600">📞 {p.phone}</p>
              <p className="text-gray-600">🩺 Last Visit: {p.lastVisit}</p>
              <div className="mt-3 flex gap-3">
                <Link to={`/patients/${p.id}`} className="text-blue-600 hover:underline">View Records</Link>
                <Link to={`/reminders?patientId=${p.id}`} className="text-green-600 hover:underline">Add Reminder</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
