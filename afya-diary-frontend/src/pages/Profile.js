// src/pages/Profile.js
import React from "react";
import PatientLayout from "../components/PatientLayout";

export default function Profile() {
  const u = localStorage.getItem("user");
  const user = u ? JSON.parse(u) : null;

 
}
