import React, { useEffect, useState } from "react";
import CHVLayout from "../../components/CHVLayout";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function CHVPatients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", age: "", gender: "" });
  const [loading, setLoading] = useState(false);

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

  const addPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/patients", form);
      toast.success("Patient added successfully!");
      setForm({ name: "", phone: "", age: "", gender: "" });
      loadPatients();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add patient");
    } finally {
      setLoading(false);
    }
  };

  const filtered = patients.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.includes(search)
  );

  return (
    <CHVLayout>
      <h1 className="text-3xl font-bold text-blue-700 mb-4">👥 Patients</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Add Patient Form */}
        <form
          onSubmit={addPatient}
          className="bg-white p-6 rounded-xl shadow-md w-full md:w-1/3"
        >
          <h3 className="text-lg font-semibold mb-3 text-blue-600">Add Patient</h3>
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full mb-3 p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            className="w-full mb-3 p-3 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="w-full mb-3 p-3 border rounded-lg"
          />
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="w-full mb-3 p-3 border rounded-lg"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            {loading ? "Saving..." : "Add Patient"}
          </button>
        </form>

        {/* Patient List */}
        <div className="flex-1 bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-blue-600">All Patients</h3>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border rounded-lg"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Age</th>
                  <th className="p-3 text-left">Gender</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length ? (
                  filtered.map((p) => (
                    <tr key={p._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{p.name}</td>
                      <td className="p-3">{p.phone}</td>
                      <td className="p-3">{p.age}</td>
                      <td className="p-3">{p.gender}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-gray-500 text-center">
                      No patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CHVLayout>
  );
}
