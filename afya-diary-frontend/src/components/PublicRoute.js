// src/components/PublicRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function getRedirectPath(user) {
  if (!user) return "/login";
  if (user.role === "patient") return "/dashboard";
  if (user.role === "chv") return "/chv-dashboard";
  if (user.role === "chemist") return "/chemist-dashboard";
  return "/dashboard";
}

export default function PublicRoute({ children }) {
  const location = useLocation();

  let token = null;
  let user = null;

  try {
    token = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    user = u ? JSON.parse(u) : null;
  } catch {
    token = null;
    user = null;
  }

  const isLoggedIn =
    token &&
    typeof token === "string" &&
    token.length > 10 && // optionally adjust length check
    user &&
    typeof user === "object" &&
    ["patient", "chv", "chemist"].includes(user.role);

  // ✅ Always allow Home page
  if (location.pathname === "/") {
    return children;
  }

  // ✅ Redirect logged-in users away from auth pages
  if (
    isLoggedIn &&
    ["/login", "/register", "/verify"].includes(location.pathname)
  ) {
    return <Navigate to={getRedirectPath(user)} replace />;
  }

  // ✅ Show public page
  return children;
}
