import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Register() {
  const [role, setRole] = useState("patient");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); // For CHV/Chemist
  const [password, setPassword] = useState(""); // For CHV/Chemist
  const [age, setAge] = useState(""); // For Patient
  const [gender, setGender] = useState(""); // For Patient
  const [shaNumber, setShaNumber] = useState(""); // For Patient
  const [licenseNumber, setLicenseNumber] = useState(""); // For Chemist
  const [pharmacyName, setPharmacyName] = useState(""); // For Chemist
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare registration data based on role
    const data = { name, phone, role };

    if (role === "patient") {
      data.age = age;
      data.gender = gender;
      data.shaNumber = shaNumber;
    }

    if (role === "chv" || role === "chemist") {
      data.email = email;
      data.password = password;
      data.shaNumber = shaNumber;
    }

    if (role === "chemist") {
      data.licenseNumber = licenseNumber;
      data.pharmacyName = pharmacyName;
     
      // data.age = age;
      // data.gender = gender;
      // data.shaNumber = shaNumber;
    }

    try {
      await api.post("/auth/request-otp", data);
      toast.success("✅ Registered! OTP sent to your phone");
    navigate("/verify", { state: { phone, role, name, shaNumber, email, password, gender, licenseNumber, pharmacyName } });


    } catch (err) {
      console.error("register error", err);
      toast.error(err.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-700 mb-2 text-center">Register</h1>
        <p className="text-gray-600 text-center mb-6">Fill in your details to create an account.</p>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          {/* Phone */}
          <input
            type="tel"
            placeholder="+2547XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          {/* Role Selector */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="patient">Patient</option>
            <option value="chv">CHV</option>
            <option value="chemist">Chemist</option>
          </select>

          {/* Conditional Fields */}
          {role === "patient" && (
            <>
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="SHA Number"
                value={shaNumber}
                onChange={(e) => setShaNumber(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </>
          )}

          {(role === "chv" || role === "chemist") && (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />

            </>
          )}
          {role === "chv" && (
            <>
            <input
                type="text"
                placeholder="SHA Number"
                value={shaNumber}
                onChange={(e) => setShaNumber(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </>)}

          {role === "chemist" && (
            <>
              <input
                type="text"
                placeholder="License Number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Pharmacy Name"
                value={pharmacyName}
                onChange={(e) => setPharmacyName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Redirect to Login */}
        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login", { state: { role } })}
            className="text-blue-600 hover:underline"
          >
            Sign In
          </button>
        </p>
        <p className="text-sm text-gray-500 mt-2 text-center">
          By logging in, you agree to our{" "}
          <a href="/terms" className="text-blue-600 hover:underline">Terms</a> &{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
