import React, { useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Records() {
  const [form, setForm] = useState({ patientId: "", type: "diagnosis", title: "", description: "" });
  const [loading, setLoading] = useState(false);

  const addRecord = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/records", form);
      toast.success("Health record saved");
      setForm({ patientId: "", type: "diagnosis", title: "", description: "" });
    } catch (err) {
      console.error(err);
      toast.error("Could not save record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-[#00695C] mb-2">📂 Health Records</h1>
      <p className="text-gray-600 mb-4">Add patient diagnoses, medications, vaccines, allergies, etc.</p>

      <div className="max-w-xl bg-white p-6 rounded-xl shadow-md">
        <form onSubmit={addRecord} className="grid gap-4">
          <input
            placeholder="Patient ID"
            value={form.patientId}
            onChange={e => setForm({ ...form, patientId: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-[#00695C]"
            required
          />
          <select
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-[#00695C]"
          >
            <option value="diagnosis">Diagnosis</option>
            <option value="medication">Medication</option>
            <option value="vaccine">Vaccine</option>
            <option value="allergy">Allergy</option>
            <option value="other">Other</option>
          </select>
          <input
            placeholder="Title (e.g., Hypertension)"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-[#00695C]"
            required
          />
          <textarea
            placeholder="Details"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-[#00695C] min-h-[120px]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#00695C] text-white py-3 rounded-lg hover:bg-[#004D40] transition font-semibold"
          >
            {loading ? "Saving..." : "Save record"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
