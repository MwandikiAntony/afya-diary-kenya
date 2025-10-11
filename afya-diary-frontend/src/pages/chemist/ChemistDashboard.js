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

export default function ChemistDashboard() {
  const [shaNumber, setShaNumber] = useState("");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dispenses, setDispenses] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDispense, setOpenDispense] = useState(false);

  // ✅ Fetch dispensed medicines
  const fetchDispenses = async () => {
    try {
      const { data } = await api.get("/chemist/dispenses");
      setDispenses(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDispenses();
  }, []);

  // ✅ Search patient by SHA number
  const handleSearch = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/patients/search/${shaNumber}`);
      if (data) {
        setPatient(data);
        toast.success("Patient found!");
      } else {
        toast.error("No patient found with that SHA number.");
      }
    } catch (error) {
      toast.error("Error finding patient.");
      setPatient(null);
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

          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Walk-in Patient</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Walk-in Patient</DialogTitle>
              </DialogHeader>
              <AddPatientForm
                onSuccess={(patientData) => {
                  toast.success("Patient added successfully!");
                  setPatient(patientData);
                  setOpenAdd(false);
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

              <div className="mt-4">
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
              </div>
            </CardContent>
          </Card>
        )}

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
function AddPatientForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    age: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone)
      return toast.error("Name and phone are required.");
    try {
      setSaving(true);
      const { data } = await api.post("/chemist/create-patient", form);
      onSuccess(data.patient);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding patient.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        placeholder="Full Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <Input
        placeholder="Phone Number"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        required
      />
      <Input
        placeholder="Email (optional)"
        name="email"
        value={form.email}
        onChange={handleChange}
      />
      <Input
        placeholder="Gender (optional)"
        name="gender"
        value={form.gender}
        onChange={handleChange}
      />
      <Input
        placeholder="Age (optional)"
        name="age"
        value={form.age}
        onChange={handleChange}
      />

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Add Patient"}
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
