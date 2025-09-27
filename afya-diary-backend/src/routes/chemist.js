const express = require('express');
const router = express.Router();
const Chemist = require('../models/Chemist');

// @desc  Get all chemists
// @route GET /chemist
router.get('/', async (req, res) => {
  try {
    const chemists = await Chemist.find();
    res.json(chemists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc  Register new chemist
// @route POST /chemist
router.post('/', async (req, res) => {
  try {
    const chemist = new Chemist(req.body);
    await chemist.save();
    res.status(201).json(chemist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
