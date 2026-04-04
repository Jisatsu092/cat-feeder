const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/feedController');

router.post('/', ctrl.manualFeed);
router.get('/history', ctrl.getHistory);

module.exports = router;