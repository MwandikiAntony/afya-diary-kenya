const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const reminderController = require('../controllers/reminderController');

// ✅ Allow only CHV, chemist, or patient to manage reminders
router.use(authMiddleware, roleMiddleware(['chv', 'chemist', 'patient']));

router.post('/', reminderController.createReminder);
router.get('/', reminderController.getMyReminders);       // view reminders created by self
router.put('/:id', reminderController.updateReminder);    // edit own reminders
router.delete('/:id', reminderController.deleteReminder); // delete own reminders
// GET /reminders/upcoming
router.get('/upcoming', reminderController.getUpcomingReminders);
// GET /reminders/overdue
router.get('/overdue', reminderController.getOverdueReminders);



module.exports = router;
