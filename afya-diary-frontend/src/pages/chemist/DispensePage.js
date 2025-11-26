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
  const [shaNumber, setShaNumber] = useState(patient?.shaNumber || ""); // ✅ dynamic + editable

  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({
    medicineId: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch medicines
  const fetchMedicines = async (selectNewMedicineId = null) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/chemist/medicines?ts=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Medicines API response:", response.data);
      const list = response.data || [];
      setMedicines(list);

      if (selectNewMedicineId) {
        setForm((prev) => ({ ...prev, medicineId: selectNewMedicineId }));
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
      toast.error("Failed to load medicines list");
    }
  };

  useEffect(() => {
    const newMedicineId = location.state?.newMedicineId || null;
    fetchMedicines(newMedicineId);

    if (location.state?.refetch || newMedicineId) {
      navigate(location.pathname, { replace: true, state: { patient } });
    }
  }, [navigate, patient, location.pathname, location.state]);

  // ✅ Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
// user data from localStorage
const user = JSON.parse(localStorage.getItem("user"));
const chemistId = user?._id || user?.id;

console.log("Chemist ID:", chemistId);  // <-- add this debug line

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!shaNumber || !form.medicineId || !form.quantity) {
    toast.error("All fields are required");
    return;
  }

  try {
    setLoading(true);

    console.log("Sending to backend:", {
      patientId: patient?._id,
      medicineId: form.medicineId,
      quantity: form.quantity,
    });

    const { data } = await api.post("/chemist/dispense", {
      patientId: patient?._id,
      medicineId: form.medicineId,
      quantity: form.quantity,
    });

    toast.success(data.message || "Medicine dispensed successfully!");
    navigate("/chemist/assign-chv", { state: { patient } });

  } catch (error) {
    console.error("Error dispensing medicine:", error);
    toast.error(error.response?.data?.message || "Failed to dispense medicine");
  } finally {
    setLoading(false);
  }
};



 

  const handleAddMedicine = () => {
    navigate("/chemist/add-medicine", {
      state: { fromDispense: true, patient },
    });
  };




  return (
    <ChemistLayout>
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-semibold mb-4">💊 Dispense Medicine</h1>

        {/* ✅ Patient Info or Manual SHA Entry */}
        {patient ? (
          <div className="mb-4 text-gray-700">
            <p><strong>Patient:</strong> {patient.name}</p>
            <p><strong>SHA Number:</strong> {patient.shaNumber}</p>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium">SHA Number</label>
            <Input
              name="shaNumber"
              placeholder="Enter patient's SHA number"
              value={shaNumber}
              onChange={(e) => setShaNumber(e.target.value)}
              required
            />
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
