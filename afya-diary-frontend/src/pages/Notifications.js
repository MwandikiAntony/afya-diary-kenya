// src/pages/Notifications.js
import React, { useEffect, useState } from "react";
import PatientLayout from "../components/PatientLayout";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications"); // ✅ your backend should return notifications for logged-in patient
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <PatientLayout>
      <h1 className="text-3xl font-bold text-[#00695C] mb-4">🔔 Notifications</h1>
      <p className="text-gray-600 mb-6">Stay updated with your health updates and appointments.</p>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-lg p-4 border-l-4 border-[#00695C]"
            >
              <p className="font-semibold text-gray-800">{n.title || "Notification"}</p>
              <p className="text-gray-600 text-sm mt-1">{n.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </PatientLayout>
  );
}
