import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import PatientLayout from "../components/PatientLayout";
import MentalHealthCard from "../components/Shared/MentalHealthCard";
import MoodTracker from "../components/AIHelper/MoodTracker";

  

export default function Dashboard() {
  console.log("🎯 Patient dashboard rendered");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/users/profile");
        setUser(data.user || JSON.parse(localStorage.getItem("user")));
      } catch (err) {
        console.error(err);
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
      }
    };
    fetch();
  }, []);

  return (
    <PatientLayout>
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

      {/* Patient Dashboard Grid */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-[#00695C] mb-2">💊 Prescriptions</h3>
          <p className="text-gray-600 mb-4">
            View your prescribed medications and instructions.
          </p>
          <Link
            to="/prescriptions"
            className="inline-block bg-[#1abc9c] text-white px-4 py-2 rounded-lg hover:bg-[#16a085] transition"
          >
            My Prescriptions
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-[#00695C] mb-2">⏰ Reminders</h3>
          <p className="text-gray-600 mb-4">
            Get SMS reminders for medications and appointments.
          </p>
          <Link
            to="/reminders"
            className="inline-block bg-[#1abc9c] text-white px-4 py-2 rounded-lg hover:bg-[#16a085] transition"
          >
            Manage Reminders
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-[#00695C] mb-2">📂 My Records</h3>
          <p className="text-gray-600 mb-4">
            Access your medical history and health logs.
          </p>
          <Link
            to="/records"
            className="inline-block bg-[#1abc9c] text-white px-4 py-2 rounded-lg hover:bg-[#16a085] transition"
          >
            View Records
          </Link>
        </div>

        {/*Mental Health card*/}
        <div className="p-6 space-y-6">
  <h1 className="text-2xl font-bold text-gray-800">Patient Dashboard</h1>
  <MentalHealthCard />
  {user && <MoodTracker userId={user._id} />}
</div>


        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-[#00695C] mb-2">📅 Appointments</h3>
          <p className="text-gray-600 mb-4">
            Book and track upcoming appointments.
          </p>
          <Link
            to="/appointments"
            className="inline-block bg-[#1abc9c] text-white px-4 py-2 rounded-lg hover:bg-[#16a085] transition"
          >
            Appointments
          </Link>
        </div>
      </section>
    </PatientLayout>
  );
}
