const express = require('express');
const router = express.Router();
const { manualFeed, getHistory } = require('../controllers/feedController');

router.post('/manual', manualFeed);
router.get('/history', getHistory);

module.exports = router;