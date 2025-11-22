import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {}; // ✅ define state
  const phone = state.phone || "";
  const role = state.role || "patient";
  const password = state.password;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60); // ⏱ countdown timer

  // Start countdown timer
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = state?.name ? "/verify-registration-otp" : "/verify-login-otp";
const { data } = await api.post(`/auth${endpoint}`, { 
  phone,
  code: otp,
  role,
  password,
  name: state.name,
  shaNumber: state.shaNumber,
  licenseNumber: state.licenseNumber,
  pharmacyName: state.pharmacyName,
  email: state.email,
});


      if (data?.token && data?.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("✅ Login successful");

        // Redirect by role
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

  // Resend OTP handler
  const resendOtp = async () => {
    if (timer > 0) return; // Prevent spamming
    setResending(true);
    try {
      await api.post("/auth/resend-otp", { phone, role });
      toast.success("OTP resent successfully!");
      setTimer(60); // Restart timer
    } catch (err) {
      console.error("resendOtp error", err);
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">Verify OTP</h1>

        {phone ? (
          <p className="text-gray-600 text-center mb-4">
            Enter the OTP sent to <strong>{phone}</strong>
          </p>
        ) : (
          <p className="text-gray-600 text-center mb-4">
            No phone number found.{" "}
            <Link to="/login" className="text-blue-600 underline">
              Go back to login
            </Link>
            .
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

        {/* ⏱ Resend OTP Section */}
        <div className="mt-4 text-center text-sm">
          {timer > 0 ? (
            <p className="text-gray-500">
              You can resend OTP in <span className="font-semibold">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={resendOtp}
              disabled={resending}
              className="text-blue-600 font-medium hover:underline disabled:text-gray-400"
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          )}

          <p className="text-sm text-gray-500 mt-6 text-center">
            Go Back to{" "}
            <button
              onClick={() => navigate("/login", { state: { role } })}
              className="text-green-600 hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
