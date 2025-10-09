const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const ctrl = require('../controllers/reportController');

// CHV and admin
router.get('/', auth, role('chv','admin'), ctrl.listReports);
router.post('/', auth, role('chv','admin'), ctrl.createReport);
router.delete('/:id', auth, role('chv','admin'), ctrl.deleteReport);

module.exports = router;
