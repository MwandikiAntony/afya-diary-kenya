// src/pages/CHV/CHVDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CHVLayout from "../../components/CHVLayout";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function CHVDashboard() {
  const [patients, setPatients] = useState([]);
  const [reminders, setReminders] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch patients
  const fetchPatients = async () => {
    try {
      const { data } = await api.get("/patients/assigned");
      setPatients(data || []);
    } catch (err) {
      console.error("Failed to fetch patients", err);
      toast.error("Failed to load assigned patients");
    }
  };

  // ✅ Fetch reminders (moved outside useEffect)
  const fetchReminders = async () => {
    try {
      const { data } = await api.get("/chv/reminders/assigned");
      setReminders(data || []);
    } catch (err) {
      console.error("Failed to fetch reminders", err);
      toast.error("Failed to load reminders");
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchReminders();
  }, []);

  return (
    <CHVLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-[#00695C] mb-6">🧑‍⚕️ CHV Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Assigned Patients */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-[#00695C] mb-2">
              👨‍👩‍👧 Assigned Patients
            </h3>
            <p className="text-gray-600 mb-4">
              Patients under your community follow-up.
            </p>
            <ul className="text-sm text-gray-700 max-h-40 overflow-y-auto">
              {patients.length > 0 ? (
                patients.map((p) => (
                  <li key={p._id} className="mb-1 border-b border-gray-100 py-1">
                    {p.name} – {p.phone}
                  </li>
                ))
              ) : (
                <li>No assigned patients yet</li>
              )}
            </ul>
            <button
              onClick={() => navigate("/chv-patients")}
              className="mt-4 bg-[#1abc9c] text-white px-4 py-2 rounded-lg hover:bg-[#16a085]"
            >
              View All Patients
            </button>
          </div>

          {/* Reports */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-[#00695C] mb-2">📑 Reports</h3>
            <p className="text-gray-600 mb-4">
              Submit household visit and health status reports.
            </p>
            <button
              onClick={() => navigate("/chv-reports")}
              className="bg-[#1abc9c] text-white px-4 py-2 rounded-lg hover:bg-[#16a085]"
            >
              Submit Report
            </button>
          </div>
        </div>

        {/* Reminders Section */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-[#00695C] mb-2">⏰ Upcoming Reminders</h3>
          <p className="text-gray-600 mb-4">
            Track reminders for your assigned patients.
          </p>

          {reminders.length === 0 ? (
            <p className="text-gray-500">No reminders yet</p>
          ) : (
            <div className="space-y-3">
              {reminders.slice(0, 5).map((r) => (
                <div
                  key={r._id}
                  className="p-4 bg-gray-50 rounded-lg border-l-4 border-[#3498db]"
                >
                  <p className="font-medium text-gray-800">{r.message}</p>
                  <p className="text-sm text-gray-600">
                    Due: {new Date(r.dueDate).toLocaleString()}
                  </p>
                  <p
                    className={`text-sm font-semibold mt-1 ${
                      r.sent ? "text-green-600" : "text-orange-500"
                    }`}
                  >
                    {r.sent ? "✅ Sent" : "⌛ Pending"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {reminders.length > 5 && (
            <button
              onClick={() => navigate("/chv-reminders")}
              className="mt-4 bg-[#1abc9c] text-white px-4 py-2 rounded-lg hover:bg-[#16a085]"
            >
              View All Reminders
            </button>
          )}
        </div>
      </div>
    </CHVLayout>
  );
}
