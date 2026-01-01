const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const firebaseAuth = require('../middleware/firebaseAuth');
const adminCheck = require('../middleware/adminCheck');

// Sync User dari Firebase ke MySQL
router.post('/sync-user', firebaseAuth, authController.syncUser);

// Get User Profile (User Biasa)
router.get('/me', firebaseAuth, authController.getUserProfile);
// ... import adminCheck ...

router.get('/users', firebaseAuth, adminCheck, authController.getAllUsers);
router.put('/users/:id/role', firebaseAuth, adminCheck, authController.updateUserRole);

module.exports = router;
module.exports = router;