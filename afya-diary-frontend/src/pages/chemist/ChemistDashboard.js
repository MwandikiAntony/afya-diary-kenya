import React, { useState, useEffect } from "react";
import ChemistLayout from "../../components/ChemistLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom"; // ⬅️ add this near top
import MentalHealthCard from "../../components/Shared/MentalHealthCard";
import MoodTracker from "../../components/AIHelper/MoodTracker";
  
  

export default function ChemistDashboard() {
  const [shaNumber, setShaNumber] = useState("");
  const [patient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dispenses, setDispenses] = useState([]);
  const [medicines, setMedicines] = useState([]);
  
  const [openDispense, setOpenDispense] = useState(false);
  const [openMedicine, setOpenMedicine] = useState(false);
  const [openRecord, setOpenRecord] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  // ✅ Fetch dispensed medicines
  const fetchDispenses = async () => {
    try {
      const { data } = await api.get("/chemist/dispenses");
      setDispenses(data);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Fetch medicines
  const fetchMedicines = async () => {
    try {
      const { data } = await api.get("/chemist/medicines");
      setMedicines(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDispenses();
    fetchMedicines();
  }, []);

  // ✅ Search patient by SHA number
const handleSearch = async () => {
  try {
    setLoading(true);
    const { data } = await api.get(`/patients/search/${shaNumber}`, {
      headers: { 'Cache-Control': 'no-cache' },
    });

    if (data && data.shaNumber) {
      toast.success("Patient found!");
      console.log("Navigating to patient page:", data);
      navigate(`/chemist/patient/${data.shaNumber}`, { state: { patient: data } });
    } else {
      toast.error("Patient not found.");
    }
  } catch (error) {
    console.error("Search error:", error);
    toast.error("Error finding patient.");
  } finally {
    setLoading(false);
  }
};



  return (
    <ChemistLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Chemist Dashboard</h1>

        {/* Search and Add Section */}
<div className="flex flex-wrap items-center gap-3">
  <Input
    placeholder="Enter SHA Number"
    value={shaNumber}
    onChange={(e) => setShaNumber(e.target.value)}
    className="w-64"
  />
  <Button onClick={handleSearch} disabled={loading}>
    {loading ? "Searching..." : "Search"}
  </Button>

  <Button
    variant="outline"
    onClick={() => navigate("/chemist/add-patient")}
  >
    ➕ Add Patient
  </Button>
          <Dialog open={openMedicine} onOpenChange={setOpenMedicine}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Medicine</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Medicine</DialogTitle>
              </DialogHeader>
              <AddMedicineForm
                onSuccess={() => {
                  toast.success("Medicine added!");
                  fetchMedicines();
                  setOpenMedicine(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Patient Details */}
        {patient && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">{patient.name}</h2>
            </CardHeader>
            <CardContent>
              <p>📞 Phone: {patient.phone}</p>
              {patient.shaNumber && <p>🧾 SHA Number: {patient.shaNumber}</p>}
              <p>👩‍⚕️ Assigned CHV: {patient.chv?.name || "Unassigned"}</p>

              <div className="mt-4 flex gap-3">
                <Dialog open={openDispense} onOpenChange={setOpenDispense}>
                  <DialogTrigger asChild>
                    <Button>Dispense Medicine</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dispense Medicine</DialogTitle>
                    </DialogHeader>
                    <DispenseForm
                      patient={patient}
                      onSuccess={() => {
                        toast.success("Medicine dispensed successfully!");
                        setOpenDispense(false);
                        fetchDispenses();
                      }}
                    />
                  </DialogContent>
                </Dialog>

                <Dialog open={openRecord} onOpenChange={setOpenRecord}>
                  <DialogTrigger asChild>
                    <Button variant="secondary">Add Record</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Patient Record</DialogTitle>
                    </DialogHeader>
                    <AddRecordForm
                      patient={patient}
                      onSuccess={() => {
                        toast.success("Record added successfully!");
                        setOpenRecord(false);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )}

       
      <MentalHealthCard />
      

      <MoodTracker userId={user._id} />
    

        {/* Medicine Stock */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Available Medicines</h2>
          </CardHeader>
          <CardContent>
            {medicines.length > 0 ? (
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Stock</th>
                    <th className="text-left p-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((m) => (
                    <tr key={m._id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{m.name}</td>
                      <td className="p-2">{m.stock}</td>
                      <td className="p-2">Ksh {m.price || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No medicines available.</p>
            )}
          </CardContent>
        </Card>

        {/* Dispensed History */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Dispensed Medicines</h2>
          </CardHeader>
          <CardContent>
            {dispenses.length > 0 ? (
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-2">Patient</th>
                    <th className="text-left p-2">Medicine</th>
                    <th className="text-left p-2">Quantity</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dispenses.map((d) => (
                    <tr key={d._id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{d.patient?.name || "N/A"}</td>
                      <td className="p-2">{d.medicine}</td>
                      <td className="p-2">{d.quantity}</td>
                      <td className="p-2">
                        {new Date(d.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No dispensed medicines yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ChemistLayout>
  );
}

/* ✅ Add Patient Form */

/* ✅ Add Medicine Form */
function AddMedicineForm({ onSuccess }) {
  const [form, setForm] = useState({ name: "", stock: "", price: "" });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.stock)
      return toast.error("Name and stock are required.");
    try {
      setSaving(true);
      await api.post("/chemist/add-medicine", form);
      onSuccess();
    } catch (error) {
      toast.error("Error adding medicine.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input placeholder="Medicine Name" name="name" value={form.name} onChange={handleChange} required />
      <Input placeholder="Stock Quantity" name="stock" type="number" value={form.stock} onChange={handleChange} required />
      <Input placeholder="Price (optional)" name="price" type="number" value={form.price} onChange={handleChange} />
      <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Add Medicine"}</Button>
    </form>
  );
}

/* ✅ Add Record Form */
function AddRecordForm({ patient, onSuccess }) {
  const [record, setRecord] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!record) return toast.error("Please enter patient record.");
    try {
      setSaving(true);
      await api.post("/chemist/add-record", { patientId: patient._id, record });
      onSuccess();
    } catch (error) {
      toast.error("Error saving record.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        className="border rounded p-2 min-h-[100px]"
        placeholder="Enter patient record..."
        value={record}
        onChange={(e) => setRecord(e.target.value)}
      />
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Add Record"}
      </Button>
    </form>
  );
}

/* ✅ Dispense Medicine Form */
function DispenseForm({ patient, onSuccess }) {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({ medicine: "", quantity: 1 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const { data } = await api.get("/chemist/medicines");
        setMedicines(data);
      } catch (error) {
        console.error("Error fetching medicines", error);
      }
    };
    fetchMedicines();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.medicine || !form.quantity)
      return toast.error("Please select medicine and quantity");
    try {
      setLoading(true);
      await api.post("/chemist/dispense", {
        patientId: patient._id,
        ...form,
      });
      onSuccess();
    } catch (error) {
      toast.error("Error dispensing medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <select
        name="medicine"
        value={form.medicine}
        onChange={handleChange}
        className="border rounded p-2"
      >
        <option value="">Select Medicine</option>
        {medicines.map((m) => (
          <option key={m._id} value={m.name}>
            {m.name} ({m.stock} left)
          </option>
        ))}
      </select>

      <Input
        name="quantity"
        type="number"
        min="1"
        value={form.quantity}
        onChange={handleChange}
        placeholder="Quantity"
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Dispensing..." : "Dispense"}
      </Button>
    </form>
  );
}

