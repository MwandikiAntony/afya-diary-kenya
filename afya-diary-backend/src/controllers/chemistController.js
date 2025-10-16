const QRToken = require('../models/QRToken');
const HealthRecord = require('../models/HealthRecord');
const jwt = require('jsonwebtoken');
const DispensedMedication = require('../models/DispensedMedication');
const Reminder = require('../models/Reminder');
const Patient = require('../models/Patient');
const Medicine = require('../models/Medicine'); // new model
const Record = require('../models/Record'); // ✅ create this model if not existing
const ChemistRecord = require("../models/ChemistRecord"); // we'll create this model below
const Chemist = require('../models/Chemist');
const User = require('../models/User');


// ✅ Chemist creates a new patient manually (not QR)
exports.createPatient = async (req, res) => {
  try {
    if (req.user.role !== 'chemist') {
      return res.status(403).json({ message: 'Only chemists can create patients' });
    }

    const { name, phone, gender, age, shaNumber } = req.body;

    if (!name || !phone || !shaNumber) {
      return res.status(400).json({ message: 'Name, phone and SHA number are required' });
    }

    // Check if patient already exists by SHA number or phone
    const existing = await Patient.findOne({
      $or: [{ phone }, { shaNumber }]
    });
    if (existing) {
      return res.status(400).json({ message: 'Patient with this phone or SHA number already exists' });
    }

    const newPatient = await Patient.create({
      name,
      phone,
      gender,
      age,
      shaNumber,
      chvId: null
 // Chemist as owner
    });

    res.status(201).json({ message: 'Patient created successfully', patient: newPatient });
  } catch (err) {
    console.error('createPatient error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Chemist records dispensed medication


exports.dispenseMedication = async (req, res) => {
  try {
    const { shaNumber, medicineId, quantity } = req.body;

    // ✅ Validate input
    if (!shaNumber || !medicineId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Find patient by SHA number
    const patient = await Patient.findOne({ shaNumber });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // ✅ Find medicine
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    // ✅ Check stock
    if (medicine.stock < quantity) {
      return res.status(400).json({
        message: `Not enough stock. Only ${medicine.stock} left.`,
      });
    }

    // ✅ Deduct stock
    medicine.stock -= Number(quantity);
    await medicine.save();

    // ✅ Record the dispense event
    const dispenseRecord = new DispensedMedication({
      chemistId: req.user._id,
      patientId: patient._id,
      medicineId: medicine._id,
      quantity,
    });

    await dispenseRecord.save();

    res.status(200).json({
      message: "Medicine dispensed successfully",
      data: dispenseRecord,
    });
  } catch (error) {
    console.error("Error dispensing medication:", error);
    res.status(500).json({ message: "Server error while dispensing" });
  }
};


exports.getMedicines = async (req, res) => {
  try {
    // ✅ Fetch all medicines (optional: filter out zero stock)
    const medicines = await Medicine.find({ stock: { $gt: 0 } })
      .select("_id name stock");

    if (!medicines.length) {
      return res.status(404).json({ message: "No medicines available" });
    }

    res.status(200).json({
      message: "Medicines fetched successfully",
      data: medicines,
    });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({ message: "Server error fetching medicines" });
  }
};


// ✅ Chemist adds medicine to stock
exports.addMedicine = async (req, res) => {
  try {
    if (req.user.role !== 'chemist') {
      return res.status(403).json({ message: 'Only chemists can add medicine' });
    }

    const { name, description, stock, price } = req.body;
    if (!name || !stock) {
      return res.status(400).json({ message: 'Name and stock are required' });
    }

    const existing = await Medicine.findOne({ name });
    if (existing) {
      existing.stock += Number(stock);
      await existing.save();
      return res.json({ message: 'Medicine stock updated', medicine: existing });
    }

    const newMed = await Medicine.create({ name, description, stock, price });
    res.status(201).json({ message: 'Medicine added successfully', medicine: newMed });
  } catch (err) {
    console.error('addMedicine error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Chemist fetches all medicines
exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ name: 1 });
    res.json(medicines);
  } catch (err) {
    console.error('getMedicines error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Assign patient to CHV
exports.assignPatientToCHV = async (req, res) => {
  try {
    const { patientId, chvId } = req.body;
    if (!patientId || !chvId) return res.status(400).json({ message: 'Patient and CHV required' });

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    patient.chvId = chvId;
    await patient.save();

    res.json({ message: 'Patient successfully assigned to CHV', patient });
  } catch (err) {
    console.error('assignPatientToCHV', err);
    res.status(500).json({ message: 'Failed to assign patient' });
  }
};

exports.generatePatientQR = async (req, res) => {
  res.json({ message: 'generatePatientQR endpoint not yet implemented' });
};

exports.scanPatientQR = async (req, res) => {
  res.json({ message: 'scanPatientQR endpoint not yet implemented' });
};


exports.addPatientRecord = async (req, res) => {
  try {
    const { patientId, diagnosis, notes } = req.body;

    if (!patientId || !diagnosis) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newRecord = new Record({
      patientId,
      diagnosis,
      notes,
      createdBy: req.user._id,
    });

    await newRecord.save();
    res.status(201).json({ message: 'Record added successfully', record: newRecord });
  } catch (err) {
    console.error('Error adding record:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



// ✅ Add a new record for a patient (using SHA number)
exports.addRecord = async (req, res) => {
  try {
    const { shaNumber, diagnosis, notes } = req.body;
    const chemistId = req.user._id;

    if (!shaNumber || !diagnosis || !notes) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 1️⃣ Find the patient using SHA number
    const patient = await Patient.findOne({ shaNumber });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // 2️⃣ Create a new record
    const record = await ChemistRecord.create({
      patientId: patient._id,
      chemistId,
      diagnosis,
      notes,
    });

    res.status(201).json({
      message: "Record added successfully.",
      record,
    });
  } catch (error) {
    console.error("Error adding record:", error);
    res.status(500).json({ message: "Server error while adding record." });
  }
};



exports.getChemistProfile = async (req, res) => {
  try {
    // ✅ Find the logged-in user AND ensure role is 'chemist'
    const chemist = await User.findOne({ _id: req.user.userId, role: 'chemist' }).select('-passwordHash');

    if (!chemist) {
      return res.status(404).json({ message: 'No chemist data found' });
    }

    res.json(chemist);
  } catch (err) {
    console.error('Error fetching chemist profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateChemistProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { location } = req.body;

    const chemist = await Chemist.findOneAndUpdate(
      { userId },
      { location },
      { new: true }
    ).populate("userId", "name phone email role");

    if (!chemist)
      return res.status(404).json({ message: "Chemist not found" });

    res.json(chemist);
  } catch (error) {
    console.error("Error updating chemist profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};





