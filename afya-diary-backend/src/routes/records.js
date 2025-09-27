const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

// @desc  Get all records
// @route GET /records
router.get('/', async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc  Add new record
// @route POST /records
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
