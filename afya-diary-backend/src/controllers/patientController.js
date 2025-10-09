const Patient = require('../models/Patient');
const User = require('../models/User');

exports.listPatients = async (req, res) => {
  try {
    // If CHV: return only those for this CHV; if admin, return all
    const user = req.user;
    const filter = {};
    if (user.role === 'chv') {
      filter.chvId = user._id;
    }
    const patients = await Patient.find(filter).sort({ createdAt: -1 });
    return res.json(patients);
  } catch (err) {
    console.error('listPatients', err);
    return res.status(500).json({ message: 'Failed to list patients' });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const { name, phone, age, gender, shaNumber } = req.body;
    if (!name || !phone) return res.status(400).json({ message: 'name and phone required' });

    // attach chvId when created by CHV
    const payload = { name, phone, age, gender, shaNumber };
    if (req.user && req.user.role === 'chv') payload.chvId = req.user._id;

    const existing = await Patient.findOne({ phone });
    if (existing) return res.status(409).json({ message: 'Patient with this phone already exists' });

    const p = await Patient.create(payload);
    return res.status(201).json(p);
  } catch (err) {
    console.error('createPatient', err);
    return res.status(500).json({ message: 'Failed to create patient' });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;

    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // CHV can only update their own patients
    if (req.user.role === 'chv' && patient.chvId && patient.chvId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    Object.assign(patient, update);
    await patient.save();
    return res.json(patient);
  } catch (err) {
    console.error('updatePatient', err);
    return res.status(500).json({ message: 'Failed to update patient' });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const id = req.params.id;
    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // CHV can only delete their patients
    if (req.user.role === 'chv' && patient.chvId && patient.chvId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Patient.findByIdAndDelete(id);
    return res.json({ ok: true, message: 'Deleted' });
  } catch (err) {
    console.error('deletePatient', err);
    return res.status(500).json({ message: 'Failed to delete patient' });
  }
};


