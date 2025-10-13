import React, { useEffect, useState } from "react";
import ChemistLayout from "../../components/ChemistLayout";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";

export default function ChemistProfile() {
  const [chemist, setChemist] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch chemist details
  useEffect(() => {
    const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await api.get("/chemist/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setChemist(data);
  } catch (error) {
    console.error("Error fetching chemist profile:", error);
    toast.error(error.response?.data?.message || "Failed to fetch chemist details.");
  } finally {
    setLoading(false);
  }
};


    fetchProfile();
  }, []);

  if (loading) {
    return (
      <ChemistLayout>
        <div className="text-center text-gray-500 py-10">Loading profile...</div>
      </ChemistLayout>
    );
  }

  if (!chemist) {
    return (
      <ChemistLayout>
        <div className="text-center text-red-500 py-10">
          No chemist data found.
        </div>
      </ChemistLayout>
    );
  }

  return (
    <ChemistLayout>
      <h1 className="text-2xl font-bold text-green-700 mb-4">👤 Chemist Profile</h1>
      <div className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto space-y-3">
        <p>
          <strong>Name:</strong> {chemist.name}
        </p>
        <p>
          <strong>Phone:</strong> {chemist.phone}
        </p>
        <p>
          <strong>Email:</strong> {chemist.email || "N/A"}
        </p>
        <p>
          <strong>License Number:</strong> {chemist.licenseNumber || "N/A"}
        </p>
        <p>
          <strong>Facility Name:</strong> {chemist.facilityName || "N/A"}
        </p>
        <p>
          <strong>Location:</strong> {chemist.location || "N/A"}
        </p>
        <p>
          <strong>Role:</strong> {chemist.role || "Chemist"}
        </p>

        <div className="pt-4">
          <Button
            onClick={() => toast("Edit functionality coming soon!")}
            className="w-full"
          >
            Edit Profile
          </Button>
        </div>
      </div>
    </ChemistLayout>
  );
}
