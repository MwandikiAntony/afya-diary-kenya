const express = require('express');
const router = express.Router();
const healthRecordController = require('../controllers/healthRecordController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes
router.post('/add', authMiddleware, healthRecordController.addRecord);
router.get('/list', authMiddleware, healthRecordController.getRecords);

module.exports = router;
