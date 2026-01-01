const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const firebaseAuth = require('../middleware/firebaseAuth');
const adminCheck = require('../middleware/adminCheck');

// Setup Multer (Upload Gambar)
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// Public
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// 🔥 ADMIN ONLY
router.post('/', firebaseAuth, adminCheck, upload.single('image'), productController.addProduct);
router.delete('/:id', firebaseAuth, adminCheck, productController.deleteProduct);
router.put('/:id', firebaseAuth, adminCheck, productController.updateProduct);

module.exports = router;