const QRToken = require('../models/QRToken');
const HealthRecord = require('../models/HealthRecord');
const jwt = require('jsonwebtoken');
const DispensedMedication = require('../models/DispensedMedication');
const Reminder = require('../models/Reminder');
const Patient = require('../models/Patient');
const Medicine = require('../models/Medicine'); // new model
const Record = require('../models/Record'); // ✅ create this model if not existing

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
    if (req.user.role !== 'chemist') {
      return res.status(403).json({ message: 'Only chemists can dispense medications' });
    }

    const { patientId, medicineId, quantity, dose, instructions, followUpDays } = req.body;

    if (!patientId || !medicineId || !quantity) {
      return res.status(400).json({ message: 'patientId, medicineId, and quantity are required' });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Reduce stock
    if (medicine.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock' });
    }
    medicine.stock -= quantity;
    await medicine.save();

    const dispensed = await DispensedMedication.create({
      patientId,
      chemistId: req.user._id,
      medicineId,
      medicineName: medicine.name,
      dose,
      instructions,
      quantity,
    });

    // Optional: Create reminder
    if (followUpDays && Number(followUpDays) > 0) {
      const reminder = await Reminder.create({
        patientId,
        message: `Follow-up for ${medicine.name}`,
        dueDate: new Date(Date.now() + followUpDays * 24 * 60 * 60 * 1000),
        status: 'pending',
        createdBy: req.user._id,
      });
      dispensed.followUpReminder = reminder._id;
      await dispensed.save();
    }

    res.status(201).json({ message: 'Medication dispensed successfully', dispensed });
  } catch (err) {
    console.error('dispenseMedication error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get all dispensed medications for a patient
exports.getDispensedMedications = async (req, res) => {
  try {
    const { patientId } = req.params;
    const records = await DispensedMedication.find({ patientId })
      .populate('medicineId', 'name')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    console.error('getDispensedMedications error:', err);
    res.status(500).json({ message: 'Server error' });
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

