const express = require('express');
const router = express.Router();
const { getSchedules, createSchedule, updateSchedule, deleteSchedule, toggleSchedule } = require('../controllers/scheduleController');

router.get('/', getSchedules);
router.post('/', createSchedule);
router.patch('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);
router.patch('/:id/toggle', toggleSchedule);

module.exports = router;