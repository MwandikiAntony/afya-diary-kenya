import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ChemistLayout from "../../components/ChemistLayout";
import { Button } from "../../components/ui/button";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function ChemistPatientPage() {
  const { state } = useLocation();
  const { shaNumber } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(state?.patient);

  useEffect(() => {
    if (!patient && shaNumber) {
      (async () => {
        try {
          const { data } = await api.get(`/patients/search/${shaNumber}`);
          setPatient(data);
        } catch (err) {
          toast.error("Failed to load patient");
          navigate("/chemist/dashboard");
        }
      })();
    }
  }, [shaNumber, patient, navigate]);

  if (!patient) {
    return (
      <ChemistLayout>
        <div className="p-6">
          <h1 className="text-xl font-bold">Loading patient...</h1>
        </div>
      </ChemistLayout>
    );
  }

  return (
    <ChemistLayout>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">{patient.name}</h1>
        <p>📞 {patient.phone}</p>
        <p>👤 {patient.gender}</p>
        <p>🎂 Age: {patient.age}</p>
        <p>🧾 SHA Number: {patient.shaNumber}</p>

        <div className="flex gap-3 mt-6">
          <Button
  onClick={() =>
    navigate(`/chemist/dispense/${patient.shaNumber}`, { state: { patient } })
  }
>
  Dispense Medicine
</Button>

<Button
  variant="secondary"
  onClick={() =>
    navigate(`/chemist/add-record/${patient.shaNumber}`, { state: { patient } })
  }
>
  Add Record
</Button>

        </div>
      </div>
    </ChemistLayout>
  );
}
