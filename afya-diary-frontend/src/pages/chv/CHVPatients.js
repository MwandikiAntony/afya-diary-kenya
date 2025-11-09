import React, { useEffect, useState } from "react";
import ChvLayout from "../../components/CHVLayout";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function ChvPatients() {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "",
     shaNumber: "", 
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      // CHVs should only see assigned patients
      const { data } = await api.get("/patients/assigned");
      setPatients(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load patients");
    }
  };

  const openModal = (patient = null) => {
    if (patient) {
      setEditing(patient._id);
      setForm({
        name: patient.name,
        phone: patient.phone,
        age: patient.age,
        gender: patient.gender,
      });
    } else {
      setEditing(null);
      setForm({ name: "", phone: "", age: "", gender: "" });
    }
    setOpen(true);
  };

  const savePatient = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/patients/${editing}`, form);
        toast.success("Patient updated successfully");
      } else {
        await api.post("/patients", form);
        toast.success("Patient added successfully");
      }
      setOpen(false);
      setEditing(null);
      setForm({ name: "", phone: "", age: "", gender: "" });
      loadPatients();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save patient");
    }
  };

  const deletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await api.delete(`/patients/${id}`);
      toast.success("Patient deleted");
      loadPatients();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <ChvLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#00695C]">
            👥 Assigned Patients
          </h1>
          <button
            onClick={() => openModal()}
            className="bg-[#00695C] hover:bg-[#004D40] text-white px-4 py-2 rounded-lg shadow-md"
          >
            + Add Patient
          </button>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-[#3498db] text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Age</th>
                <th className="p-3 text-left">Gender</th>
                <th className="p-3 text-center">Actions</th>
                <th className="p-3 text-left">SHA Number</th>
              </tr>
            </thead>
            <tbody>
              {patients.length ? (
                patients.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.phone}</td>
                    <td className="p-3">{p.age}</td>
                    <td className="p-3 capitalize">{p.gender}</td>
                    <td className="p-3">{p.shaNumber}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => openModal(p)}
                        className="border border-blue-600 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePatient(p._id)}
                        className="border border-red-600 text-red-600 px-3 py-1 rounded-md hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No patients assigned yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <h2 className="text-xl font-semibold mb-4 text-[#00695C]">
                {editing ? "Edit Patient" : "Add New Patient"}
              </h2>

              <form onSubmit={savePatient} className="grid gap-3">
                <input
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="p-3 border rounded-lg"
                  required
                />
                <input
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="p-3 border rounded-lg"
                  required
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="p-3 border rounded-lg"
                />
                                <input
                  placeholder="SHA Number"
                  value={form.shaNumber}
                  onChange={(e) => setForm({ ...form, shaNumber: e.target.value })}
                  className="p-3 border rounded-lg"
                  required
                />

                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="p-3 border rounded-lg"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00695C] hover:bg-[#004D40] text-white rounded-lg"
                  >
                    {editing ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ChvLayout>
  );
}
