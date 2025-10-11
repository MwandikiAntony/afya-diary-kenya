const Patient = require("../models/Patient");
const QRCode = require("qrcode");

/**
 * @desc List patients
 * If user is CHV, only show their patients.
 */
exports.listPatients = async (req, res) => {
  try {
    const user = req.user;
    const filter = {};

    if (user.role === "chv") {
      filter.chvId = user._id;
    }

    const patients = await Patient.find(filter).sort({ createdAt: -1 });
    return res.json(patients);
  } catch (err) {
    console.error("listPatients", err);
    return res.status(500).json({ message: "Failed to list patients" });
  }
};

/**
 * @desc Create patient
 * Generates QR code and links patient to CHV
 */
exports.createPatient = async (req, res) => {
  try {
    const { name, phone, age, gender, shaNumber } = req.body;

    if (!shaNumber) {
      return res.status(400).json({ message: "SHA number is required." });
    }

    const existingSha = await Patient.findOne({ shaNumber });
    if (existingSha) {
      return res.status(400).json({ message: "SHA number already exists." });
    }

    const patient = await Patient.create({
      name,
      phone,
      age,
      gender,
      shaNumber,
      chvId: req.user?._id,
    });

    res.status(201).json(patient);
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * @desc Update patient
 */
exports.updatePatient = async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;

    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Restrict CHV from editing other CHVs' patients
    if (
      req.user.role === "chv" &&
      patient.chvId &&
      patient.chvId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    Object.assign(patient, update);
    await patient.save();
    return res.json(patient);
  } catch (err) {
    console.error("updatePatient", err);
    return res.status(500).json({ message: "Failed to update patient" });
  }
};

/**
 * @desc Delete patient
 */
exports.deletePatient = async (req, res) => {
  try {
    const id = req.params.id;
    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    if (
      req.user.role === "chv" &&
      patient.chvId &&
      patient.chvId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Patient.findByIdAndDelete(id);
    return res.json({ ok: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("deletePatient", err);
    return res.status(500).json({ message: "Failed to delete patient" });
  }
};

/**
 * @desc Generate QR Code for a patient
 */
exports.getPatientQRCode = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const qrData = patient._id.toString();
    const qrImage = await QRCode.toDataURL(qrData);

    res.json({ qrImage });
  } catch (err) {
    console.error("getPatientQRCode", err);
    res.status(500).json({ message: "Error generating QR code" });
  }
};



// ✅ Search patient by SHA Number
// controllers/patientController.js
exports.searchPatient = async (req, res) => {
  try {
    const { sha } = req.params;
    console.log(`Searching for SHA: ${sha}`);

    const patient = await Patient.findOne({ shaNumber: sha });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    console.log("Search result:", patient);
    res.status(200).json(patient); // ✅ force 200, not 304
  } catch (error) {
    console.error("Error searching patient:", error);
    res.status(500).json({ message: "Server error" });
  }
};


