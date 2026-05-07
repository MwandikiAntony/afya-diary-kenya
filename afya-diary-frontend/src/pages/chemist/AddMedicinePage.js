import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ChemistLayout from "../../components/ChemistLayout";
import { PageHeader, Card, Btn, Inp, FONTS, BASE_STYLES } from "../../components/Shared/UI";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function AddMedicinePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm]     = useState({ name: "", stock: "", price: "" });
  const [loading, setLoading] = useState(false);

  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.stock) {
      toast.error("Medicine name and stock are required");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/chemist/add-medicine", {
        name: form.name,
        stock: Number(form.stock),
        price: form.price ? Number(form.price) : 0,
      });
      toast.success(data.message || "Medicine added successfully");

      if (location.state?.fromDispense) {
        navigate("/chemist/dispense", {
          state: { patient: location.state.patient, refetch: true },
          replace: true,
        });
      } else {
        navigate("/chemist-inventory");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChemistLayout>
      <link href={FONTS} rel="stylesheet" />
      <style>{BASE_STYLES}</style>

      <PageHeader
        eyebrow="Chemist Portal"
        title="Add New Medicine"
        subtitle="Add a medicine to your pharmacy inventory."
      />

      <div style={{ maxWidth: 460 }}>
        <Card>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Inp
              label="Medicine Name"
              name="name"
              value={form.name}
              onChange={set}
              required
              placeholder="e.g. Amoxicillin 500mg"
            />
            <Inp
              label="Stock Quantity"
              name="stock"
              type="number"
              value={form.stock}
              onChange={set}
              required
              placeholder="Number of units in stock"
            />
            <Inp
              label="Price per Unit (KSh)"
              name="price"
              type="number"
              value={form.price}
              onChange={set}
              placeholder="Optional"
            />

            <div style={{
              background: "#f8fafc", borderRadius: 8, padding: "10px 14px",
              fontSize: ".8rem", color: "#64748b", lineHeight: 1.6,
            }}>
              If this medicine already exists in your inventory, the stock will be added to the existing quantity.
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <Btn variant="outline" full onClick={() => navigate(-1)}>Cancel</Btn>
              <Btn type="submit" full disabled={loading}>{loading ? "Adding..." : "Add Medicine"}</Btn>
            </div>
          </form>
        </Card>
      </div>
    </ChemistLayout>
  );
}