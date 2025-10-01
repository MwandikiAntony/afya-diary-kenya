// src/pages/Verify.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if verify opened directly and we don't have phone, send user back
    if (!phone) {
      // small UX: allow returning to login
    }
  }, [phone]);

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // backend expects { phone, code } (your backend verifies 'code')
      const { data } = await api.post("/auth/verify-otp", { phone, code: otp });

      if (data?.token && data?.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("✅ Login successful");

        // redirect by role
        if (data.user.role === "patient") navigate("/dashboard");
        else if (data.user.role === "chv") navigate("/chv-dashboard");
        else if (data.user.role === "chemist") navigate("/chemist-dashboard");
        else navigate("/dashboard");
      } else {
        toast.error("Unexpected server response");
      }
    } catch (err) {
      console.error("verifyOtp error", err);
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">Verify OTP</h1>

        {phone ? (
          <p className="text-gray-600 text-center mb-4">Enter the OTP sent to <strong>{phone}</strong></p>
        ) : (
          <p className="text-gray-600 text-center mb-4">
            No phone number found. <Link to="/login" className="text-blue-600 underline">Go back to login</Link>.
          </p>
        )}

        <form onSubmit={verifyOtp} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
