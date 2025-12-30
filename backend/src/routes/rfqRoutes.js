const express = require('express');
const router = express.Router();
const rfqController = require('../controllers/rfqController'); // Pastikan path ini benar
const firebaseAuth = require('../middleware/firebaseAuth'); // Pastikan path ini benar

// Endpoint POST /rfq (Butuh Login)
router.post('/', firebaseAuth, rfqController.createRFQ);

// Endpoint GET /rfq/my-requests (Riwayat RFQ User)
router.get('/my-requests', firebaseAuth, rfqController.getMyRFQs);

module.exports = router;