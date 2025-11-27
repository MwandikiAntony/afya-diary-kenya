import React, { useEffect, useState } from "react";
import api from "../utils/api";

function Stock() {
  const [medicines, setMedicines] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  // Fetch stock on load
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const { data } = await api.get("/stock");
        setMedicines(data);
      } catch (err) {
        console.error("Error fetching stock", err);
      }
    };

    fetchStock();
  }, []);

  // Add medicine
  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/stock", { name, quantity });
      setMedicines([...medicines, data]);
      setName("");
      setQuantity("");
    } catch (err) {
      console.error("Error adding medicine", err);
    }
  };

  // Update quantity
  const handleUpdate = async (id) => {
    const newQty = prompt("Enter new quantity:");
    if (!newQty) return;

    try {
      const { data } = await api.put(`/stock/${id}`, { quantity: newQty });
      setMedicines(
        medicines.map((med) => (med._id === id ? data : med))
      );
    } catch (err) {
      console.error("Error updating medicine", err);
    }
  };

  // Delete medicine
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/stock/${id}`);
      setMedicines(medicines.filter((med) => med._id !== id));
    } catch (err) {
      console.error("Error deleting medicine", err);
    }
  };

  return (
    <div>
      <h2>📦 Medicine Stock</h2>

      {/* Add new medicine form */}
      <form onSubmit={handleAddMedicine}>
        <input
          type="text"
          placeholder="Medicine name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <button type="submit">Add Medicine</button>
      </form>

      {/* List medicines */}
      <h3>Current Stock</h3>
      <ul>
        {medicines.map((med) => (
          <li key={med._id}>
            {med.name} — {med.quantity} units
            {"  "}
            <button onClick={() => handleUpdate(med._id)}>Update</button>
            <button onClick={() => handleDelete(med._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Stock;
