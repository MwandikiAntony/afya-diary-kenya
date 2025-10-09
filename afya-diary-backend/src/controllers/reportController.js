const Report = require('../models/Report');
const Patient = require('../models/Patient');
const mongoose = require("mongoose");


exports.listReports = async (req, res) => {
  try {
    // CHV: show only reports submitted by them (or all if admin)
    const user = req.user;
    const filter = {};
    if (user.role === 'chv') filter.submittedBy = user._id;

    const reports = await Report.find(filter).sort({ createdAt: -1 }).populate('patientId', 'name phone');
    return res.json(reports);
  } catch (err) {
    console.error('listReports', err);
    return res.status(500).json({ message: 'Failed to list reports' });
  }
};

exports.createReport = async (req, res) => {
  try {
    const { patientId, title, notes, location, date } = req.body;
    if (!title) return res.status(400).json({ message: 'title required' });

    // optional: ensure patient exists
    if (patientId) {
  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    return res.status(400).json({ message: 'Invalid patientId format' });
  }
  const patient = await Patient.findById(patientId);
  if (!patient) return res.status(400).json({ message: 'Patient not found' });
}


    const r = await Report.create({
      title,
      notes,
      patientId: patientId || null,
      location,
      date: date || Date.now(),
      submittedBy: req.user._id
    });

    return res.status(201).json(r);
  } catch (err) {
    console.error('createReport', err);
    return res.status(500).json({ message: 'Failed to create report' });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const id = req.params.id;
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    // CHV can only delete their own reports
    if (req.user.role === 'chv' && report.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Report.findByIdAndDelete(id);
    return res.json({ ok: true, message: 'Deleted' });
  } catch (err) {
    console.error('deleteReport', err);
    return res.status(500).json({ message: 'Failed to delete report' });
  }
};
