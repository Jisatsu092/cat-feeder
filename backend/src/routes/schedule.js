const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/scheduleController');

router.get('/', ctrl.getSchedules);
router.post('/', ctrl.createSchedule);
router.patch('/:id', ctrl.updateSchedule);
router.delete('/:id', ctrl.deleteSchedule);
router.patch('/:id/toggle', ctrl.toggleSchedule);

module.exports = router;