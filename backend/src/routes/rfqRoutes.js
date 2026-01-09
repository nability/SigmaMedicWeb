const express = require('express');
const router = express.Router();

// 🔥 IMPORT CONTROLLER & MIDDLEWARE YANG BENAR
const rfqController = require('../controllers/rfqController'); 
const firebaseAuth = require('../middleware/firebaseAuth');
const adminCheck = require('../middleware/adminCheck'); // Pastikan file ini ada

// === USER ROUTES ===
// User biasa boleh kirim RFQ
router.post('/', firebaseAuth, rfqController.createRFQ);
// User melihat history RFQ sendiri
router.get('/my-requests', firebaseAuth, rfqController.getMyRFQs);

// === ADMIN ROUTES ===
// 🔥 Hanya Admin yang boleh lihat SEMUA data
router.get('/all', firebaseAuth, adminCheck, rfqController.getAllRFQs); 
// 🔥 Hanya Admin yang boleh proses (Approve/Reject)
router.put('/:id/process', firebaseAuth, adminCheck, rfqController.processRFQ); 

// ...
router.get('/my-history', firebaseAuth, rfqController.getMyRFQs); // Endpoint baru
// ...

module.exports = router;