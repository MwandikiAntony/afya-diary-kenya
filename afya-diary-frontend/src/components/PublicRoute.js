import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

export default function PublicRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Loader />;
  if (isLoggedIn) return <Navigate to="/dashboard" replace />;
  return children;
}
