import React, { useState } from "react";
import ChemistLayout from "../../components/ChemistLayout";
import BarcodeScanner from "react-qr-barcode-scanner"; // ✅ default import
import toast from "react-hot-toast";
import api from "../../utils/api";

export default function ChemistScan() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(true);

  const handleScan = async (scanData) => {
    if (scanData?.text && scanning) {
      setScanning(false);
      setLoading(true);

      try {
        const token = scanData.text;
        const res = await api.post("/chemist/verify-qr", { token });

        setData(res.data);
        toast.success("Prescription found!");
      } catch (err) {
        console.error("QR Verify Error:", err);
        toast.error(err.response?.data?.message || "Invalid or expired QR code");
        setScanning(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleError = (err) => {
    console.error("Scanner Error:", err);
    toast.error("Camera access denied or unavailable.");
  };

  const resetScanner = () => {
    setData(null);
    setScanning(true);
  };

  return (
    <ChemistLayout>
      <h1 className="text-2xl font-bold text-green-700 mb-4">
        🔍 Scan Prescription
      </h1>
      <p className="text-gray-600 mb-4">
        Use your device camera to scan patient QR codes and verify prescriptions.
      </p>

      {!data && (
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
          {scanning ? (
            <div className="w-full max-w-md">
              <BarcodeScanner
                width={300}
                height={300}
                onUpdate={(err, result) => {
                  if (result) handleScan({ text: result.text });
                  if (err) handleError(err);
                }}
              />
              <p className="text-sm text-gray-500 mt-2">
                Align the QR code within the frame to scan.
              </p>
            </div>
          ) : (
            <p className="text-gray-500">Processing QR code...</p>
          )}
        </div>
      )}

      {data && (
        <div className="bg-white p-6 rounded-xl shadow-md mt-6">
          <h2 className="text-xl font-semibold text-green-700 mb-4">
            🧾 Prescription Details
          </h2>

          {data.patient && (
            <div className="mb-3">
              <p><strong>Patient Name:</strong> {data.patient.name}</p>
              <p><strong>Gender:</strong> {data.patient.gender}</p>
              <p><strong>DOB:</strong> {new Date(data.patient.dob).toLocaleDateString()}</p>
            </div>
          )}

          {data.prescription ? (
            <div className="mb-4">
              <p><strong>Diagnosis:</strong> {data.prescription.diagnosis}</p>
              <p><strong>Medication:</strong> {data.prescription.medication}</p>
              <p><strong>Prescribed On:</strong> {new Date(data.prescription.createdAt).toLocaleDateString()}</p>
            </div>
          ) : (
            <p className="text-red-500">No prescription found for this patient.</p>
          )}

          <button
            onClick={resetScanner}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Scan Another
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center text-gray-500 mt-4">
          Verifying prescription...
        </div>
      )}
    </ChemistLayout>
  );
}
