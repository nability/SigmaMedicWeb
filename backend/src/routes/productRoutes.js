const express = require("express");
const router = express.Router();
const product = require("../controllers/productController");
const upload = require("../middleware/upload");

router.get("/", product.getProducts);
router.post("/", upload.single("image"), product.createProduct);
router.get("/:id", product.getProductById);
router.put("/:id", product.updateProduct);
router.delete("/:id", product.deleteProduct);

module.exports = router;
