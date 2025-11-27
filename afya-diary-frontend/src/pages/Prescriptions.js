import React, { useEffect, useState } from "react";
import PatientLayout from "../components/PatientLayout";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get("/prescriptions");

      //  Ensure we always set an array — even if backend returns object or something else
      if (Array.isArray(data)) {
        setPrescriptions(data);
      } else if (Array.isArray(data.prescriptions)) {
        setPrescriptions(data.prescriptions);
      } else {
        console.warn("Unexpected prescriptions response format:", data);
        setPrescriptions([]);
      }
    } catch (err) {
      console.error("Failed to load prescriptions", err);
      toast.error("Failed to load prescriptions");
      setPrescriptions([]); // fallback to empty list
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <PatientLayout>
      <h1 className="text-3xl font-bold text-[#00695C] mb-2">💊 My Prescriptions</h1>
      <p className="text-gray-600 mb-6">
        View and track your prescribed medicines and dosage instructions.
      </p>

      {loading ? (
        <p className="text-gray-500">Loading prescriptions...</p>
      ) : prescriptions.length === 0 ? (
        <p className="text-gray-500">No prescriptions found.</p>
      ) : (
        <div className="grid gap-4">
          {prescriptions.map((p) => (
            <div
              key={p._id || Math.random()}
              className="bg-white shadow-md rounded-xl p-5 border-l-4 border-[#00695C]"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {p.medication || "Medication"}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    p.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {p.status || "pending"}
                </span>
              </div>

              <p className="text-gray-700 mt-2">
                <span className="font-semibold">Dosage:</span> {p.dosage || "N/A"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Frequency:</span> {p.frequency || "N/A"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Prescribed by:</span>{" "}
                {p.doctor?.name || "Doctor"}
              </p>

              {p.instructions && (
                <p className="text-gray-600 mt-2 italic">“{p.instructions}”</p>
              )}

              <p className="text-xs text-gray-400 mt-3">
                Issued on {new Date(p.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </PatientLayout>
  );
}
