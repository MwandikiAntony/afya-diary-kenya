import React, { useState } from "react";
import ChemistLayout from "../../components/ChemistLayout";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function ChemistDashboard() {
  const [scanResult, setScanResult] = useState(null);
  const [chvId, setChvId] = useState("");

  const handleAssign = async () => {
    try {
      const res = await api.post("/chemist/assign", {
        patientId: scanResult,
        chvId,
      });
      toast.success("Patient assigned successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign");
    }
  };

  return (
    <ChemistLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-[#00695C] mb-6">
          💊 Chemist Dashboard
        </h1>

        {/* QR Scanner */}
        <div className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto">
          <h2 className="font-semibold mb-3 text-lg">📷 Scan Patient QR</h2>

          <BarcodeScannerComponent
            width={300}
            height={300}
            onUpdate={(err, result) => {
              if (result) setScanResult(result.text);
            }}
          />

          {scanResult && (
            <div className="mt-4 bg-green-50 p-3 rounded">
              <h3 className="font-semibold">Scan Result</h3>
              <pre className="text-sm text-gray-700 mt-2">{scanResult}</pre>

              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Enter CHV ID"
                  className="border p-2 rounded w-full mb-3"
                  value={chvId}
                  onChange={(e) => setChvId(e.target.value)}
                />
                <button
                  onClick={handleAssign}
                  className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                >
                  ✅ Assign to CHV
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ChemistLayout>
  );
}
