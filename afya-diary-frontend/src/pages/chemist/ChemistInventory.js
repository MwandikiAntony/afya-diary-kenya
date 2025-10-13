import React, { useState, useEffect } from "react";
import ChemistLayout from "../../components/ChemistLayout";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function ChemistInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const res = await api.get("/chemist/medicines");
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching medicines:", err);
        toast.error("Failed to fetch medicines");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  return (
    <ChemistLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4">📦 Inventory</h1>

        {loading ? (
          <p className="text-gray-500">Loading medicines...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">No medicines available.</p>
        ) : (
          <table className="w-full bg-white rounded-xl shadow-md">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="text-left py-3 px-4">Medicine</th>
                <th className="text-left py-3 px-4">Quantity</th>
                <th className="text-left py-3 px-4">Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((med) => (
                <tr key={med._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{med.name}</td>
                  <td className="py-3 px-4">{med.stock}</td>
                  <td className="py-3 px-4">
                    {med.price ? `KSh ${med.price}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </ChemistLayout>
  );
}
