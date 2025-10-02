// src/pages/Reminders.js
import React, { useEffect, useState } from "react";
import PatientLayout from "../components/PatientLayout";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Reminders() {
  const [items, setItems] = useState([]);

  const load = async () => {
    try {
      const { data } = await api.get("/reminders/mine"); // only patient reminders
      setItems(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reminders");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <PatientLayout>
      <h1 className="text-3xl font-bold text-[#00695C] mb-2">⏰ My Reminders</h1>
      <p className="text-gray-600 mb-6">Stay updated with medication and appointment alerts.</p>

      {items.length === 0 ? (
        <p className="text-gray-500">No reminders yet</p>
      ) : (
        <div className="grid gap-4">
          {items.map((r) => (
            <div
              key={r._id}
              className="bg-white p-5 rounded-xl shadow-md border-l-4 border-[#3498db]"
            >
              <p className="text-gray-800 font-medium">{r.message}</p>
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
    </PatientLayout>
  );
}
