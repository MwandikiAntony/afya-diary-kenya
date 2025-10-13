import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ChemistLayout from "../../components/ChemistLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function AddMedicine() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ check if we came from Dispense

  const [form, setForm] = useState({
    name: "",
    stock: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle add medicine submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.stock || !form.price) {
      toast.error("Medicine name, stock, and price are required.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/chemist/add-medicine", {
        name: form.name,
        stock: Number(form.stock),
        price: Number(form.price),
      });

      toast.success(data.message || "Medicine added successfully!");
      setForm({ name: "", stock: "", price: "" });

      // ✅ If came from Dispense page, go back and refetch
      if (location.state?.fromDispense) {
        navigate("/chemist/dispense", {
          state: { patient: location.state.patient, refetch: true },
          replace: true,
        });
      } else {
        // ✅ Otherwise go to inventory
        navigate("/chemist-inventory");
      }
    } catch (error) {
      console.error("Error adding medicine:", error);
      toast.error(
        error.response?.data?.message || "Failed to add medicine. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChemistLayout>
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-semibold mb-6">➕ Add New Medicine</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Medicine Name</label>
            <Input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter medicine name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Stock Quantity</label>
            <Input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Enter quantity in stock"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Price (KSh)</label>
            <Input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price per unit"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Medicine"}
          </Button>
        </form>
      </div>
    </ChemistLayout>
  );
}
