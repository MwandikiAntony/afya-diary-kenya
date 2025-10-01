// src/pages/ChemistDashboard.js
import React, { useState } from "react";
import Layout from "../components/Layout";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export default function ChemistDashboard() {
  const [scanResult, setScanResult] = useState("No result");

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-3xl font-bold text-[#00695C] mb-4">💊 Chemist Dashboard</h1>

        <div className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto">
          <h2 className="font-semibold mb-3">📷 Scan Patient QR</h2>

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
                <button className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">
                  Mark as Dispensed
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
