// src/pages/CHVDashboard.js
import React, { useEffect, useState } from "react";
import CHVLayout from "../components/CHVLayout";
import api from "../utils/api";

export default function CHVDashboard() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Example API call to fetch assigned patients
    const fetchPatients = async () => {
      try {
        const { data } = await api.get("/patients/assigned");
        setPatients(data || []);
      } catch (err) {
        console.error("Failed to fetch patients", err);
      }
    };
    fetchPatients();
  }, []);

  return (
    <CHVLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-[#00695C] mb-6">
          🧑‍⚕️ CHV Dashboard
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Assigned Patients */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-[#00695C] mb-2">
              👨‍👩‍👧 Assigned Patients
            </h3>
            <p className="text-gray-600 mb-4">
              Patients under your community follow-up.
            </p>
            <ul className="text-sm text-gray-700">
              {patients.length > 0 ? (
                patients.map((p) => (
                  <li key={p.id} className="mb-1">
                    {p.name} – {p.phone}
                  </li>
                ))
              ) : (
                <li>No assigned patients yet</li>
              )}
            </ul>
          </div>

          {/* Community Reminders */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-[#00695C] mb-2">⏰ Reminders</h3>
            <p className="text-gray-600 mb-4">
              Schedule visits and follow-up reminders for households.
            </p>
            <button className="bg-[#1abc9c] text-white px-4 py-2 rounded-lg hover:bg-[#16a085]">
              Manage Reminders
            </button>
          </div>

          {/* Reports */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-[#00695C] mb-2">📑 Reports</h3>
            <p className="text-gray-600 mb-4">
              Submit household visit and health status reports.
            </p>
            <button className="bg-[#1abc9c] text-white px-4 py-2 rounded-lg hover:bg-[#16a085]">
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </CHVLayout>
  );
}
