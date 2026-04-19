// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const DEMO_MODE = true;

export default function ProtectedRoute({ children, role }) {
  // 🚀 Demo mode bypass (no login required)
  if (DEMO_MODE) {
    return children;
  }

  let token = null;
  let user = null;

  try {
    token = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    user = u ? JSON.parse(u) : null;
  } catch (err) {
    console.error("Error parsing localStorage user:", err);
    token = null;
    user = null;
  }

  const isLoggedIn =
    token &&
    typeof token === "string" &&
    token.length > 10 &&
    user &&
    typeof user === "object" &&
    ["patient", "chv", "chemist"].includes(user.role);

  // 🚫 Not logged in
  if (!isLoggedIn) {
    console.warn("User not logged in or invalid token");
    return <Navigate to="/login" replace />;
  }

  // 🚫 Wrong role
  if (role && user.role !== role) {
    console.warn(`Unauthorized: Expected role ${role}, got ${user.role}`);
    return <Navigate to="/" replace />;
  }

  // ✅ Access granted
  return children;
}