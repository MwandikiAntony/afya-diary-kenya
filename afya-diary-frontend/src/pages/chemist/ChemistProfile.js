import React from "react";
import ChemistLayout from "../../components/ChemistLayout";

export default function ChemistProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <ChemistLayout>
      <h1 className="text-2xl font-bold text-green-700 mb-4">👤 Profile</h1>
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </ChemistLayout>
  );
}
