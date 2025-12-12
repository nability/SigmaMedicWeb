const db = require("../config/db");

// GET ALL PRODUCTS
exports.getProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    res.json(results);
  });
};

// GET PRODUCT BY ID
exports.getProductById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM products WHERE id = ?", [id], (err, results) => {
    if (results.length === 0)
      return res.status(404).json({ message: "Product not found" });

    res.json(results[0]);
  });
};

// CREATE PRODUCT
exports.createProduct = (req, res) => {
  const { name, description, price, image_url } = req.body;

  db.query(
    "INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)",
    [name, description, price, image_url],
    (err) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ message: "Product created" });
    }
  );
};

// UPDATE PRODUCT
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url } = req.body;

  db.query(
    "UPDATE products SET name=?, description=?, price=?, image_url=? WHERE id=?",
    [name, description, price, image_url, id], // <-- tambahkan 'id' di sini
    (err) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ message: "Product updated" });
    }
  );
};

// DELETE PRODUCT
exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json({ message: "Product deleted" });
  });
};
