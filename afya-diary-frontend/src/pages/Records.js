import React, { useEffect, useState } from "react";
import PatientLayout from "../components/PatientLayout";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Records() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ type: "diagnosis", title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get("/records/mine"); // Ensure only patient's own records
      setRecords(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load records");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveRecord = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await api.put(`/records/${editing._id}`, form);
        toast.success("Record updated");
      } else {
        await api.post("/records", form);
        toast.success("Record saved");
      }
      setForm({ type: "diagnosis", title: "", description: "" });
      setEditing(null);
      load();
    } catch (err) {
      console.error(err);
      toast.error("Could not save record");
    } finally {
      setLoading(false);
    }
  };

  const editRecord = (r) => {
    setForm({ type: r.type, title: r.title, description: r.description });
    setEditing(r);
  };

  return (
    <PatientLayout>
      <h1 className="text-3xl font-bold text-[#00695C] mb-2">📂 My Health Records</h1>
      <p className="text-gray-600 mb-4">
        You can view and manage your health history, diagnosis and previous treatments.
      </p>

      {/* Form */}
      <div className="max-w-xl bg-white p-6 rounded-xl shadow-md mb-8">
        <form onSubmit={saveRecord} className="grid gap-4">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-[#00695C]"
          >
            <option value="diagnosis">Diagnosis</option>
            <option value="medication">Medication</option>
            <option value="vaccine">Vaccine</option>
            <option value="allergy">Allergy</option>
            <option value="other">Other</option>
          </select>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-[#00695C]"
            required
          />
          <textarea
            placeholder="Details"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-[#00695C] min-h-[100px]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#00695C] text-white py-3 rounded-lg hover:bg-[#004D40] transition font-semibold"
          >
            {loading ? "Saving..." : editing ? "Update record" : "Save record"}
          </button>
        </form>
      </div>

      {/* Records list */}
      <div className="grid gap-4">
        {records.length === 0 ? (
          <p className="text-gray-500">No records found</p>
        ) : (
          records.map((r) => (
            <div key={r._id} className="bg-white p-5 rounded-xl shadow-md border-l-4 border-[#00695C]">
              <h2 className="text-xl font-semibold text-gray-800">{r.title}</h2>
              <p className="text-sm text-gray-500 capitalize">{r.type}</p>
              <p className="mt-2 text-gray-700">{r.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                Added on {new Date(r.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => editRecord(r)}
                className="mt-3 bg-[#3498db] text-white px-3 py-1 rounded hover:bg-[#2980b9] transition"
              >
                Edit
              </button>
            </div>
          ))
        )}
      </div>
    </PatientLayout>
  );
}
