const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST /contact
router.post('/', contactController.sendContactMessage);

module.exports = router;