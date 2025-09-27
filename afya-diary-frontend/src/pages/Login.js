import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

function Login() {
  const [formData, setFormData] = useState({ phone: "", pin: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/users/login", formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6F2F5]">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#00695C] mb-4 text-center">AfyaDiary Kenya</h2>
        <h3 className="text-xl text-center text-gray-700 mb-6">Login</h3>

        {error && <p className="text-red-600 mb-3 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#00695C]"
            required
          />
          <input
            type="password"
            name="pin"
            placeholder="4-digit PIN"
            value={formData.pin}
            onChange={handleChange}
            maxLength="4"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#00695C]"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#00695C] text-white py-3 rounded-lg hover:bg-[#004D40] transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-[#00695C] font-semibold cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
