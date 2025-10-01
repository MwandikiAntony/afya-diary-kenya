// src/pages/VerifyOTP.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const phone = state?.phone;

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", { phone, otp });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Login successful");

      // redirect by role
      if (data.user.role === "patient") navigate("/dashboard");
      else if (data.user.role === "chv") navigate("/chv-dashboard");
      else if (data.user.role === "chemist") navigate("/chemist-dashboard");
      else navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Verify OTP
        </h1>
        <p className="text-sm text-gray-600 text-center mb-4">
          Enter the code sent to <strong>{phone}</strong>
        </p>
        <form onSubmit={verifyOtp} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
