// src/components/PublicRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

function getRedirectPath(user) {
  if (!user) return "/login";
  if (user.role === "patient") return "/dashboard";
  if (user.role === "chv") return "/chv-dashboard";
  if (user.role === "chemist") return "/chemist-dashboard";
  return "/dashboard";
}

/**
 * PublicRoute
 * - If user is logged in, redirect to their dashboard
 * - Otherwise show the public page (children)
 */
export default function PublicRoute({ children }) {
  let token = null;
  let user = null;

  try {
    token = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    user = u ? JSON.parse(u) : null;
  } catch (err) {
    console.error("Invalid localStorage user:", err);
    token = null;
    user = null;
  }

  if (token && user) {
    return <Navigate to={getRedirectPath(user)} replace />;
  }

  return children;
}
