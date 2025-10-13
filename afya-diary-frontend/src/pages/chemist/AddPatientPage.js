import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import toast from "react-hot-toast";
import api from "../../utils/api"; // ✅ your axios instance
import ChemistLayout from "../../components/ChemistLayout";

export default function AddPatientPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    age: "",
    shaNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.shaNumber) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/chemist/create-patient", form);
toast.success(res.data.message || "Patient added successfully!");

// ✅ Pass the newly created patient to DispensePage
navigate("/chemist/dispence", { state: { patient: res.data.patient } });

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChemistLayout>
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add Walk-in Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                name="name"
                placeholder="Enter patient name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Gender</Label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="border rounded-md w-full p-2"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <Label>Age</Label>
              <Input
                name="age"
                type="number"
                placeholder="Enter age"
                value={form.age}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>SHA Number</Label>
              <Input
                name="shaNumber"
                placeholder="Enter SHA number"
                value={form.shaNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Add Patient"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    </ChemistLayout>
  );
}
