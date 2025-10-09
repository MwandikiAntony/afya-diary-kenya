import React from "react";
import ChemistLayout from "../../components/ChemistLayout";

export default function ChemistScan() {
  return (
    <ChemistLayout>
      <h1 className="text-2xl font-bold text-green-700 mb-4">🔍 Scan Prescription</h1>
      <p className="text-gray-600 mb-4">Use your device camera to scan patient QR codes and verify prescriptions.</p>
      <div className="bg-white p-6 rounded-xl shadow-md text-gray-500 text-center">
        QR Scanner coming soon...
      </div>
    </ChemistLayout>
  );
}
