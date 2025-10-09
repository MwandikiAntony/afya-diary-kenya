import React, { useState } from "react";
import CHVLayout from "../../components/CHVLayout";
import toast from "react-hot-toast";

export default function CHVProfile() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const saveProfile = () => {
    localStorage.setItem("user", JSON.stringify(user));
    toast.success("Profile updated!");
  };

  return (
    <CHVLayout>
      <h1 className="text-3xl font-bold text-blue-700 mb-4">👤 Profile</h1>
      <div className="max-w-md bg-white p-6 rounded-xl shadow-md">
        <label className="block mb-2">Full Name</label>
        <input
          name="name"
          value={user.name || ""}
          onChange={handleChange}
          className="w-full mb-3 p-3 border rounded-lg"
        />

        <label className="block mb-2">Phone</label>
        <input
          name="phone"
          value={user.phone || ""}
          onChange={handleChange}
          className="w-full mb-3 p-3 border rounded-lg"
        />

        <label className="block mb-2">Location</label>
        <input
          name="location"
          value={user.location || ""}
          onChange={handleChange}
          className="w-full mb-3 p-3 border rounded-lg"
        />

        <button
          onClick={saveProfile}
          className="w-full py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
        >
          Save Changes
        </button>
      </div>
    </CHVLayout>
  );
}
