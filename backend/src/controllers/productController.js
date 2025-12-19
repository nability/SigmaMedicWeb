const db = require("../config/db");

// GET ALL PRODUCTS
exports.getProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(results);
  });
};

// CREATE PRODUCT
exports.createProduct = (req, res) => {
  const { name, description, price, stock } = req.body;
  const image = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO products (name, description, price, stock, image_url)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, description, price, stock, image],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "DB error", err });
      }
      res.json({ message: "Produk berhasil ditambahkan" });
    }
  );
};


// ==========================
// GET PRODUCT BY ID
// ==========================
exports.getProductById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM products WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (results.length === 0)
      return res.status(404).json({ message: "Product not found" });
    res.json(results[0]);
  });
};


// ==========================
// UPDATE PRODUCT
// ==========================
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;

  db.query(
    "UPDATE products SET name=?, description=?, price=?, stock=? WHERE id=?",
    [name, description, price, stock, id],
    (err) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ message: "Product updated" });
    }
  );
};

// ==========================
// DELETE PRODUCT
// ==========================
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json({ message: "Product deleted" });
  });
};
