const express = require('express');
const router = express.Router();
const {
    generateTrip,
    getUserTrips,
    getTripById,
    updateTrip,
    deleteTrip
} = require('../controllers/tripController');
const auth = require('../middleware/auth'); // JWT Firewall

// All routes here are protected by the auth middleware
router.post('/generate', auth, generateTrip);
router.get('/', auth, getUserTrips);
router.get('/:id', auth, getTripById);
router.put('/:id', auth, updateTrip);
router.delete('/:id', auth, deleteTrip);

module.exports = router;