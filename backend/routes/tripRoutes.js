const express = require('express');
const router = express.Router();
const { generateTrip } = require('../controllers/tripController');
const auth = require('../middleware/auth'); // Our JWT firewall

// Protected route: requires valid Bearer token
router.post('/generate', auth, generateTrip);

module.exports = router;