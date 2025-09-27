import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    // quick token presence check (you could replace with API check)
    const token = localStorage.getItem("token");
    setOk(!!token);
    // small delay to avoid flicker
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Loader />;
  if (!ok) return <Navigate to="/login" replace />;
  return children;
}
