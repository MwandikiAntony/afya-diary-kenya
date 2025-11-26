import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChemistLayout from "../../components/ChemistLayout";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";

export default function AssignCHVPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const patient = location.state?.patient;
  const [chvs, setChvs] = useState([]);
  const [chvId, setChvId] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/chemist/chvs");
        setChvs(data);
      } catch {
        toast.error("Failed to load CHVs");
      }
    })();
  }, []);

  const handleAssign = async () => {
    if (!chvId) {
      toast.error("Select a CHV");
      return;
    }

    try {
      const { data } = await api.post("/chemist/assign-chv", {
        patientId: patient._id,
        chvId,
      });

      toast.success("Patient assigned to CHV!");
      navigate("/chemist/dashboard");
    } catch (err) {
      toast.error("Failed to assign CHV");
    }
  };

  return (
    <ChemistLayout>
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold">Assign Patient to CHV</h1>

        <p className="mt-3 text-gray-700">
          Patient: <strong>{patient?.name}</strong>
        </p>

        <label className="block mt-4">Select CHV</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={chvId}
          onChange={(e) => setChvId(e.target.value)}
        >
          <option value="">-- Choose CHV --</option>
          {chvs.map((chv) => (
            <option key={chv._id} value={chv._id}>
              {chv.name} ({chv.phone})
            </option>
          ))}
        </select>

        <Button onClick={handleAssign} className="w-full mt-4">
          Assign to CHV
        </Button>
      </div>
    </ChemistLayout>
  );
}
