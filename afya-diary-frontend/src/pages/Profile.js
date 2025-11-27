import React from "react";
import PatientLayout from "../components/PatientLayout";

export default function Profile() {
  const u = localStorage.getItem("user");
  const user = u ? JSON.parse(u) : null;

  return (
    <PatientLayout>
      <h1 className="text-3xl font-bold text-[#00695C] mb-6">⚙️ My Profile</h1>

      {user ? (
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md">
          <p className="mb-2">
            <span className="font-semibold text-gray-700">👤 Name:</span>{" "}
            {user.name}
          </p>
          <p className="mb-2">
            <span className="font-semibold text-gray-700">📱 Phone:</span>{" "}
            {user.phone}
          </p>
          <p className="mb-2 capitalize">
            <span className="font-semibold text-gray-700">🧾 Role:</span>{" "}
            {user.role}
          </p>
          <p className="mb-2">
            <span className="font-semibold text-gray-700">🏥 SHA:</span>{" "}
            {user.shaNumber || "—"}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">No profile available</p>
      )}
    </PatientLayout>
  );
}
