import React, { useState } from "react";
import ChemistLayout from "../../components/ChemistLayout";

export default function ChemistInventory() {
  const [items] = useState([
    { id: 1, name: "Paracetamol", quantity: 50 },
    { id: 2, name: "Amoxicillin", quantity: 20 },
  ]);

  return (
    <ChemistLayout>
      <h1 className="text-2xl font-bold text-green-700 mb-4">📦 Inventory</h1>
      <table className="w-full bg-white rounded-xl shadow-md">
        <thead className="bg-green-700 text-white">
          <tr>
            <th className="text-left py-3 px-4">Medicine</th>
            <th className="text-left py-3 px-4">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {items.map((med) => (
            <tr key={med.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{med.name}</td>
              <td className="py-3 px-4">{med.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ChemistLayout>
  );
}
