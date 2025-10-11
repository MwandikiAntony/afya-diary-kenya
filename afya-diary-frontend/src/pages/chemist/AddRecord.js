import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import ChemistLayout from "../../components/ChemistLayout";

export default function AddRecordPage() {
  const { shaNumber } = useParams();
  const { state } = useLocation();
  const patient = state?.patient;
  const navigate = useNavigate();

  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/chemist/add-record", {
        shaNumber,
        diagnosis,
        treatment,
      });
      toast.success("Record added successfully!");
      navigate(`/chemist/patient/${shaNumber}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add record");
    }
  };

  return (
    <ChemistLayout>
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Add Record for {patient?.name || "Patient"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Diagnosis"
            className="w-full border rounded px-3 py-2"
            required
          />
          <textarea
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            placeholder="Treatment plan"
            className="w-full border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Save Record
          </button>
        </form>
      </div>
    </ChemistLayout>
  );
}
