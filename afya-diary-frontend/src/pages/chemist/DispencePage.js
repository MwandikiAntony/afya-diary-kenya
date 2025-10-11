import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChemistLayout from "../../components/ChemistLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function DispensePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const patient = location.state?.patient;
  const shaNumber = patient?.shaNumber;

  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({
    shaNumber: shaNumber || "",
    medicineId: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch medicines from backend
  const fetchMedicines = async (selectNewMedicineId = null) => {
    try {
      const { data } = await api.get("/chemist/medicines");
      const list = data.data || [];
      setMedicines(list);

      // ✅ Auto-select newly added medicine if provided
      if (selectNewMedicineId) {
        setForm((prev) => ({ ...prev, medicineId: selectNewMedicineId }));
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
      toast.error("Failed to load medicines list");
    }
  };

  useEffect(() => {
    // If coming back from Add Medicine page, select the new medicine
    const newMedicineId = location.state?.newMedicineId || null;
    fetchMedicines(newMedicineId);

    // Clear refetch/newMedicineId flags to prevent loops
    if (location.state?.refetch || newMedicineId) {
      navigate(location.pathname, {
        replace: true,
        state: { patient },
      });
    }
  }, [navigate, patient, location.pathname, location.state]);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle dispense submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.shaNumber || !form.medicineId || !form.quantity) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/chemist/dispense", form);
      toast.success(data.message || "Medicine dispensed successfully!");

      // Update local stock immediately
      setMedicines((prev) =>
        prev.map((m) =>
          m._id === form.medicineId
            ? { ...m, stock: m.stock - Number(form.quantity) }
            : m
        )
      );

      // Reset quantity & selection
      setForm({ ...form, medicineId: "", quantity: "" });
    } catch (error) {
      console.error("Error dispensing medicine:", error);
      toast.error(
        error.response?.data?.message || "Failed to dispense medicine"
      );
    } finally {
      setLoading(false);
    }
  };

  // Navigate to Add Medicine page
  const handleAddMedicine = () => {
    navigate("/chemist/add-medicine", {
      state: { fromDispense: true, patient },
    });
  };

  return (
    <ChemistLayout>
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-semibold mb-4">💊 Dispense Medicine</h1>

        {patient && (
          <div className="mb-4 text-gray-700">
            <p><strong>Patient:</strong> {patient.name}</p>
            <p><strong>SHA Number:</strong> {patient.shaNumber}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Select Medicine</label>
            <select
              name="medicineId"
              value={form.medicineId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">-- Select Medicine --</option>
              {medicines.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.stock} left)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <Input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Dispensing..." : "Dispense"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={handleAddMedicine}
            >
              ➕ Add Medicine
            </Button>
          </div>
        </form>
      </div>
    </ChemistLayout>
  );
}
