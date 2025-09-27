import React, { useEffect, useState } from "react";
import api from "../utils/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", shaNumber: "" });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const { data } = await api.get("/patients");
      setPatients(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load patients");
    }
  };

  const savePatient = async (e) => {
    e.preventDefault();
    try {
      await api.post("/patients", form);
      toast.success("Patient added");
      setForm({ name: "", phone: "", shaNumber: "" });
      setShowModal(false);
      loadPatients();
    } catch (err) {
      console.error(err);
      toast.error("Could not save patient");
    }
  };

  return (
    <Layout>
      {/* Header and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#00695C]">👥 Patients</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#1abc9c] text-white px-4 py-2 rounded-lg hover:bg-[#16a085] transition"
        >
          + New Patient
        </button>
      </div>

      {/* Patients Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-[#3498db] text-white">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Phone</th>
              <th className="text-left px-4 py-2">SHA</th>
            </tr>
          </thead>
          <tbody>
            {patients.length ? (
              patients.map((p) => (
                <tr key={p._id} className="border-b last:border-b-0">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.phone}</td>
                  <td className="px-4 py-2">{p.shaNumber || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 py-4">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-[#3498db] mb-4">Add Patient</h3>
            <form className="flex flex-col gap-3" onSubmit={savePatient}>
              <input
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-[#00695C]"
                required
              />
              <input
                placeholder="+2547XXXXXXXX"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-[#00695C]"
                required
              />
              <input
                placeholder="SHA number (optional)"
                value={form.shaNumber}
                onChange={(e) => setForm({ ...form, shaNumber: e.target.value })}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-[#00695C]"
              />
              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  className="bg-[#3498db] text-white px-4 py-2 rounded-lg hover:bg-[#2980b9] transition flex-1"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-[#e74c3c] text-white px-4 py-2 rounded-lg hover:bg-[#c0392b] transition flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
