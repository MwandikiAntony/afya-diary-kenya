const Prescription = require("../models/Prescription");

// ✅ Chemist adds prescription for a patient
exports.addPrescription = async (req, res) => {
  try {
    const { patientId, medication, dosage, instructions } = req.body;

    if (!patientId || !medication || !dosage) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prescription = await Prescription.create({
      patient: patientId,
      chemist: req.user._id, // logged-in chemist
      medication,
      dosage,
      instructions,
    });

    res.status(201).json({ message: "Prescription added", prescription });
  } catch (err) {
    console.error("addPrescription error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Patient fetches their prescriptions
exports.getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user._id })
      .populate("chemist", "phone")
      .sort({ createdAt: -1 });

    res.json({ prescriptions });
  } catch (err) {
    console.error("getMyPrescriptions error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Chemist updates status
exports.updatePrescriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "dispensed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const prescription = await Prescription.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.json({ message: "Status updated", prescription });
  } catch (err) {
    console.error("updatePrescriptionStatus error", err);
    res.status(500).json({ message: "Server error" });
  }
};
