// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/request-otp", { phone });
      toast.success("✅ OTP sent to your phone");
      navigate("/verify", { state: { phone } });
    } catch (err) {
      console.error("sendOtp error", err);
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-800 mb-2 text-center">Afyadiary Kenya</h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your phone number to receive a one-time password (OTP).
        </p>

        <form onSubmit={sendOtp} className="space-y-4">
          <input
            type="tel"
            placeholder="+2547XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          By logging in, you agree to our{" "}
          <a href="/terms" className="text-blue-600 hover:underline">Terms</a> &{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
