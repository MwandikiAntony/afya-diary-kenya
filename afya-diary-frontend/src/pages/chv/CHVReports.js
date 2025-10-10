import React, { useEffect, useState } from "react";
import CHVLayout from "../../components/CHVLayout";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function CHVReports() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({ patientId: "", title: "", notes: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const { data } = await api.get("/reports");
      setReports(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reports");
    }
  };

  const saveReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/reports", form);
      toast.success("Report saved");
      setForm({ patientId: "", title: "", notes: "" });
      loadReports();
    } catch (err) {
      console.error(err);
      toast.error("Could not save report");
    } finally {
      setLoading(false);
    }
  };

  const removeReport = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await api.delete(`/reports/${id}`);
      toast.success("Deleted");
      loadReports();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <CHVLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-[#00695C] mb-6">📑 CHV Reports</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Report Form */}
          <form onSubmit={saveReport} className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-[#00695C]">New Report</h3>

            <input
              placeholder="Patient ID"
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              required
              className="w-full mb-3 p-3 border rounded-lg"
            />

            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full mb-3 p-3 border rounded-lg"
            />

            <textarea
              placeholder="Notes / Findings"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full mb-3 p-3 border rounded-lg min-h-[100px]"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#00695C] text-white rounded-lg hover:bg-[#004D40] transition"
            >
              {loading ? "Saving..." : "Save Report"}
            </button>
          </form>

          {/* Reports List */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-[#00695C]">Existing Reports</h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-[#3498db] text-white">
                  <tr>
                    <th className="p-3 text-left">Patient</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Notes</th>
                    <th className="p-3 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length ? (
                    reports.map((r) => (
                      <tr key={r._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          {r.patientId?.name || r.patientId || "N/A"}
                        </td>
                        <td className="p-3">{r.title}</td>
                        <td className="p-3">{r.notes}</td>
                        <td className="p-3">
                          <button
                            onClick={() => removeReport(r._id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-4 text-gray-500 text-center">
                        No reports found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </CHVLayout>
  );
}
