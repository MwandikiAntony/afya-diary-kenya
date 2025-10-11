import React, { useEffect, useState } from "react";
// You can replace with ChemistLayout if you have one
import api from "../../utils/api";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import toast from "react-hot-toast";
import ChemistLayout from "../../components/ChemistLayout";

export default function DispensedMedications() {
  const [dispensed, setDispensed] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all dispensed medications
  useEffect(() => {
    const fetchDispensed = async () => {
      try {
        setLoading(true);
        const res = await api.get("/chemist/dispensed/all"); // We'll modify backend to support this route
        setDispensed(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch dispensed medications");
      } finally {
        setLoading(false);
      }
    };
    fetchDispensed();
  }, []);

  // Filtered list
  const filtered = dispensed.filter(
    (item) =>
      item.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      item.medicineName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ChemistLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dispensed Medications</h1>

        <div className="flex items-center gap-3 mb-4">
          <Input
            placeholder="Search by patient name or medicine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <p>No dispensed medications found.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <Card
                key={item._id}
                className="hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedPatient(item)}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {item.patientName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Medicine:</strong> {item.medicineName}
                  </p>
                  <p>
                    <strong>Dosage:</strong> {item.dosage}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Details Dialog */}
        <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Medication Details</DialogTitle>
            </DialogHeader>
            {selectedPatient && (
              <div className="space-y-2">
                <p><strong>Patient:</strong> {selectedPatient.patientName}</p>
                <p><strong>Medicine:</strong> {selectedPatient.medicineName}</p>
                <p><strong>Dosage:</strong> {selectedPatient.dosage}</p>
                <p><strong>Frequency:</strong> {selectedPatient.frequency}</p>
                <p><strong>Instructions:</strong> {selectedPatient.instructions}</p>
                <p>
                  <strong>Date Dispensed:</strong>{" "}
                  {new Date(selectedPatient.createdAt).toLocaleString()}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ChemistLayout>
  );
}
