const db = require("../config/db");
const fs = require('fs');
const path = require('path');

// ==========================================
// PUBLIC FUNCTIONS (Bisa Diakses Siapa Saja)
// ==========================================

// 1. Ambil Semua Produk
exports.getAllProducts = (req, res) => {
  const query = "SELECT * FROM products";
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Gagal mengambil data produk" });
    }
    res.json(results);
  });
};

// 2. Ambil Detail 1 Produk
exports.getProductById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM products WHERE id = ?";
  
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Server Error" });
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    
    res.json(results[0]);
  });
};

// ==========================================
// ADMIN FUNCTIONS (Hanya Admin)
// ==========================================

// 3. Tambah Produk Baru
exports.addProduct = (req, res) => {
  const { name, description, price, stock } = req.body;
  // Cek apakah ada file gambar yang diupload via Multer
  const image_url = req.file ? req.file.filename : null; 

  const query = "INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)";
  
  db.query(query, [name, description, price, stock, image_url], (err, result) => {
    if (err) {
      console.error("Error adding product:", err);
      return res.status(500).json({ message: "Gagal tambah produk", error: err });
    }
    res.status(201).json({ message: "Produk berhasil ditambahkan" });
  });
};

// 4. Hapus Produk
exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  // Langkah 1: Cari nama gambar dulu supaya bisa dihapus dari folder 'uploads'
  db.query("SELECT image_url FROM products WHERE id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database Error" });

    // Jika ada gambar fisik, hapus filenya
    if (rows.length > 0 && rows[0].image_url) {
      const imagePath = path.join(__dirname, '../../uploads', rows[0].image_url);
      // Cek apakah file benar-benar ada sebelum unlink
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (e) {
          console.error("Gagal hapus file gambar:", e);
        }
      }
    }

    // Langkah 2: Hapus data dari Database
    db.query("DELETE FROM products WHERE id = ?", [id], (errDel) => {
      if (errDel) return res.status(500).json({ message: "Gagal hapus produk dari DB" });
      res.json({ message: "Produk berhasil dihapus" });
    });
  });
};

// 5. Update Produk (Nama, Harga, Stok)
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;
  
  // Note: Update gambar butuh logic lebih kompleks, ini versi basic dulu
  const query = "UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?";
  
  db.query(query, [name, price, stock, id], (err) => {
    if (err) return res.status(500).json({ message: "Gagal update produk" });
    res.json({ message: "Produk berhasil diupdate" });
  });
};