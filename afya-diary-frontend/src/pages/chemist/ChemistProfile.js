import React, { useEffect, useState } from "react";
import ChemistLayout from "../../components/ChemistLayout";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";

export default function ChemistProfile() {
  const [chemist, setChemist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [fetchingLocation, setFetchingLocation] = useState(false);

  // Fetch chemist details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get("/chemist/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChemist(data);
        setLocation(data.location || "");
      } catch (error) {
        console.error("Error fetching chemist profile:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch chemist details."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Detect current GPS location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setFetchingLocation(true);
    toast("Getting your current location...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const address =
            data.display_name ||
            `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
          setLocation(address);
          toast.success("📍 Location detected!");
        } catch (err) {
          console.error("Reverse geocode error:", err);
          setLocation(`Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`);
          toast("Using GPS coordinates as location.");
        } finally {
          setFetchingLocation(false);
        }
      },
      (err) => {
        console.error("Location error:", err);
        toast.error("Unable to get location. Please enable GPS.");
        setFetchingLocation(false);
      }
    );
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.patch(
        "/chemist/profile",
        { location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Profile updated successfully!");
      setChemist(data);
      setOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update location.");
    }
  };

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
        <p><strong>Name:</strong> {chemist.name}</p>
        <p><strong>Phone:</strong> {chemist.phone}</p>
        <p><strong>Email:</strong> {chemist.email || "N/A"}</p>
        <p><strong>License Number:</strong> {chemist.licenseNumber || "N/A"}</p>
        <p><strong>Facility Name:</strong> {chemist.pharmacyName || "N/A"}</p>
        <p><strong>Location:</strong> {chemist.location || "N/A"}</p>
        <p><strong>Role:</strong> {chemist.role || "Chemist"}</p>

        {/* ✅ Manual control for opening dialog */}
        <div className="pt-4">
          <Button
            onClick={() => setOpen(true)}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* ✅ Custom Dialog — works with your own Dialog.js */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Update Chemist Location</DialogTitle>
        </DialogHeader>

        <DialogContent>
          <div className="space-y-3 mt-2">
            <Button
              onClick={detectLocation}
              disabled={fetchingLocation}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {fetchingLocation ? "Detecting..." : "📍 Use Current Location"}
            </Button>

            <Input
              placeholder="Enter location manually"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </DialogContent>

        <DialogFooter className="mt-4">
          <Button
            onClick={handleSave}
            className="w-full bg-green-700 hover:bg-green-800 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </Dialog>
    </ChemistLayout>
  );
}
