import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/users/profile");
        setUser(data.user || JSON.parse(localStorage.getItem("user")));
      } catch (err) {
        console.error(err);
        // fallback to local storage
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
      }
    };
    fetch();
  }, []);

  return (
    <Layout>
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#00695C]">
          Welcome back to Afyadiary Kenya
        </h1>
        {user && (
          <p className="text-gray-600 mt-2 text-lg">
            {user.name} • <span className="capitalize">{user.role}</span>
          </p>
        )}
      </header>

      {/* Dashboard Grid */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-[#00695C] mb-2">👩‍⚕️ Patients</h3>
          <p className="text-gray-600 mb-4">
            Manage patients' records, view history & add new entries.
          </p>
          <Link
            to="/patients"
            className="inline-block bg-[#1abc9c] text-white px-4 py-2 rounded-lg hover:bg-[#16a085] transition"
          >
            Open Patients
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-[#00695C] mb-2">⏰ Reminders</h3>
          <p className="text-gray-600 mb-4">
            Schedule SMS reminders for medications and visits.
          </p>
          <Link
            to="/reminders"
            className="inline-block bg-[#1abc9c] text-white px-4 py-2 rounded-lg hover:bg-[#16a085] transition"
          >
            Manage Reminders
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-[#00695C] mb-2">📂 Records</h3>
          <p className="text-gray-600 mb-4">
            View and export patient medical logs.
          </p>
          <Link
            to="/records"
            className="inline-block bg-[#1abc9c] text-white px-4 py-2 rounded-lg hover:bg-[#16a085] transition"
          >
            View Records
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-[#00695C] mb-2">📅 Appointments</h3>
          <p className="text-gray-600 mb-4">
            Track upcoming appointments and visits.
          </p>
          <Link
            to="/appointments"
            className="inline-block bg-[#1abc9c] text-white px-4 py-2 rounded-lg hover:bg-[#16a085] transition"
          >
            Appointments
          </Link>
        </div>
      </section>
    </Layout>
  );
}
