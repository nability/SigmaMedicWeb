const db = require("../config/db").promise();

// POST /rfq
exports.createRFQ = async (req, res) => {
  const { product_id, quantity, hospital_name, license_number, notes } = req.body;
  const { id: user_id } = req.user; // Dari middleware auth

  try {
    // 1. Validasi Input
    if (!hospital_name || !license_number) {
      return res.status(400).json({ message: "Nama RS & Nomor Izin wajib diisi" });
    }

    // 2. Simpan ke Database
    const query = `
      INSERT INTO quotations 
      (user_id, product_id, quantity, hospital_name, license_number, notes, status) 
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `;
    
    await db.query(query, [user_id, product_id, quantity, hospital_name, license_number, notes]);

    // 3. (Opsional) Kirim Email Notifikasi ke Admin bahwa ada Request baru
    // sendEmailToAdmin(...)

    res.status(201).json({ message: "Permintaan penawaran berhasil dikirim. Cek status di dashboard." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memproses RFQ" });
  }
};

// GET /rfq/my-requests (Untuk ditampilkan di Dashboard User)
exports.getMyRFQs = async (req, res) => {
  const { id: user_id } = req.user;

  try {
    const query = `
      SELECT q.*, p.name as product_name, p.image_url 
      FROM quotations q
      JOIN products p ON q.product_id = p.id
      WHERE q.user_id = ?
      ORDER BY q.created_at DESC
    `;
    const [rows] = await db.query(query, [user_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};