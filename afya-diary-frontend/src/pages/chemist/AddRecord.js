import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChemistLayout from "../../components/ChemistLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea"; // ✅ fixed import
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function AddRecord() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shaNumber: state?.patient?.shaNumber || "",
    diagnosis: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.shaNumber || !form.diagnosis) {
      toast.error("SHA Number and diagnosis are required.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/chemist/add-record", form);
      toast.success(data.message || "Record added successfully!");
      navigate("/chemist/dashboard");
    } catch (error) {
      console.error("Error adding record:", error);
      toast.error(
        error.response?.data?.message || "Failed to add record. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChemistLayout>
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">🩺 Add Medical Record</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">SHA Number</label>
            <Input
              name="shaNumber"
              value={form.shaNumber}
              onChange={handleChange}
              placeholder="Enter SHA Number"
              readOnly={!!state?.patient?.shaNumber} // ✅ prevent accidental edit
              className={state?.patient?.shaNumber ? "bg-gray-100" : ""}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Diagnosis</label>
            <Input
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
              placeholder="Enter diagnosis"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Additional notes (optional)"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Record"}
          </Button>
        </form>
      </div>
    </ChemistLayout>
  );
}
