const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

// Get all records
// GET /records
router.get('/', async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new record
//  POST /records
router.post('/', async (req, res) => {
  try {
    const record = new Record(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
