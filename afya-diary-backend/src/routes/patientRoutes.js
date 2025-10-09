const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authMiddleware'); // ensures req.user
const role = require('../middlewares/roleMiddleware');

const ctrl = require('../controllers/patientController');

// CHV and admin access
router.get('/', auth, role('chv','admin'), ctrl.listPatients);
router.post('/', auth, role('chv','admin'), ctrl.createPatient);
router.put('/:id', auth, role('chv','admin'), ctrl.updatePatient);
router.delete('/:id', auth, role('chv','admin'), ctrl.deletePatient);

module.exports = router;
