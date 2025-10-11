import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import ChemistLayout from "../../components/ChemistLayout";

export default function DispensePage() {
  const { shaNumber } = useParams();
  const { state } = useLocation();
  const patient = state?.patient;
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/chemist/dispense", {
        shaNumber,
        medicine,
        quantity,
      });
      toast.success("Medicine dispensed successfully!");
      navigate(`/chemist/patient/${shaNumber}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to dispense medicine");
    }
  };

  return (
    <ChemistLayout>
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Dispense Medicine for {patient?.name || "Patient"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            placeholder="Medicine name"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            className="w-full border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Dispense
          </button>
        </form>
      </div>
    </ChemistLayout>
  );
}
