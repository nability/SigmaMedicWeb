const db = require("../config/db");
const nodemailer = require('nodemailer');

// --- KONFIGURASI EMAIL (NODEMAILER) ---
// Ganti dengan email & app password asli Anda
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sigma.medic.dom@gmail.com', // ⚠️ GANTI DENGAN EMAIL ASLI ANDA
    pass: 'ohvk ubta vjxi jqnc'    // ⚠️ GANTI DENGAN APP PASSWORD
  }
});

// ==========================================
// USER FUNCTIONS
// ==========================================

// 1. User Mengirim RFQ (Create)
exports.createRFQ = async (req, res) => {
  const { product_id, quantity, hospital_name, license_number, notes } = req.body;
  const firebaseUid = req.user ? req.user.uid : null;

  if (!firebaseUid) {
    return res.status(401).json({ message: "Unauthorized: User tidak dikenali." });
  }

  try {
    // Cari ID User MySQL berdasarkan Firebase UID
    const getUserID = () => {
      return new Promise((resolve, reject) => {
        db.query("SELECT id FROM users WHERE firebase_uid = ?", [firebaseUid], (err, results) => {
          if (err) reject(err);
          if (results.length === 0) resolve(null);
          else resolve(results[0].id);
        });
      });
    };

    const sqlUserId = await getUserID();

    if (!sqlUserId) {
      return res.status(404).json({ message: "Data user tidak ditemukan. Silakan login ulang." });
    }

    // Insert ke Tabel Quotations
    const insertQuery = `
      INSERT INTO quotations 
      (user_id, product_id, quantity, hospital_name, license_number, notes, status, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;

    db.query(
      insertQuery,
      [sqlUserId, product_id, quantity, hospital_name, license_number, notes],
      (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ message: "Gagal menyimpan ke database" });
        }
        res.status(201).json({ message: "RFQ Berhasil dikirim" });
      }
    );

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// 2. User Melihat History Request Sendiri
exports.getMyRFQs = (req, res) => {
  const firebaseUid = req.user.uid;

  // Kita join user dulu untuk memastikan ID-nya benar
  const query = `
    SELECT q.*, p.name as product_name, p.image_url 
    FROM quotations q
    JOIN products p ON q.product_id = p.id
    JOIN users u ON q.user_id = u.id
    WHERE u.firebase_uid = ?
    ORDER BY q.created_at DESC
  `;

  db.query(query, [firebaseUid], (err, results) => {
    if (err) return res.status(500).json({ message: "Database Error" });
    res.json(results);
  });
};

// ==========================================
// ADMIN FUNCTIONS
// ==========================================

// 3. [ADMIN] Ambil SEMUA Request
exports.getAllRFQs = (req, res) => {
  const query = `
    SELECT q.*, u.name as user_name, u.email as user_email, p.name as product_name 
    FROM quotations q
    JOIN users u ON q.user_id = u.id
    JOIN products p ON q.product_id = p.id
    ORDER BY q.created_at DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error" });
    res.json(results);
  });
};

// 4. [ADMIN] Proses Request (Approve/Reject & Kirim Email)
exports.processRFQ = (req, res) => {
  const { id } = req.params;
  const { status, price_quote, admin_notes } = req.body;

  // Ambil data user & rfq dulu untuk kirim email
  const getEmailQuery = `
    SELECT q.*, u.email, u.name, p.name as product_name 
    FROM quotations q
    JOIN users u ON q.user_id = u.id 
    JOIN products p ON q.product_id = p.id
    WHERE q.id = ?
  `;

  db.query(getEmailQuery, [id], (err, rows) => {
    if (err || rows.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
    
    const rfqData = rows[0];

    // Update Status di Database
    const updateQuery = "UPDATE quotations SET status = ?, price_quote = ?, admin_notes = ? WHERE id = ?";
    
    db.query(updateQuery, [status, price_quote || 0, admin_notes, id], (errUpdate) => {
      if (errUpdate) return res.status(500).json({ message: "Gagal update status" });

      // LOGIC KIRIM EMAIL (Hanya jika Approved)
      if (status === 'quotation_sent') {
        const mailOptions = {
          from: '"Sigma Medic Admin" <no-reply@sigmamedic.com>',
          to: rfqData.email,
          subject: `Penawaran Harga Disetujui - ${rfqData.product_name}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
              <h2 style="color: #5B8A62;">Permintaan Penawaran Disetujui</h2>
              <p>Halo <strong>${rfqData.name}</strong>,</p>
              <p>Admin kami telah meninjau permintaan Anda untuk <strong>${rfqData.product_name}</strong>.</p>
              
              <div style="background: #f9f9f9; padding: 15px; margin: 20px 0;">
                <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">Disetujui</span></p>
                <p><strong>Total Harga Penawaran:</strong> Rp ${parseInt(price_quote).toLocaleString('id-ID')}</p>
                <p><strong>Catatan Admin:</strong> ${admin_notes || '-'}</p>
              </div>

              <p>Silakan lakukan pembayaran sesuai instruksi perusahaan.</p>
              <p>Terima kasih,<br/>Tim Sigma Medic</p>
            </div>
          `
        };

        transporter.sendMail(mailOptions, (errMail) => {
          if (errMail) {
            console.log("Gagal kirim email (tapi data terupdate):", errMail);
          } else {
            console.log("Email terkirim ke:", rfqData.email);
          }
        });
      }

      res.json({ message: "RFQ Berhasil diproses!" });
    });
  });
};

// Ambil RFQ milik user yang sedang login
exports.getMyRFQs = (req, res) => {
  const { uid } = req.user; // Dari middleware firebaseAuth

  // Cari user_id dulu berdasarkan firebase_uid
  db.query("SELECT id FROM users WHERE firebase_uid = ?", [uid], (err, users) => {
    if (err || users.length === 0) return res.status(404).json({ message: "User not found" });

    const userId = users[0].id;

    // Ambil data RFQ + Nama Produk
    const query = `
      SELECT q.*, p.name as product_name, p.image_url 
      FROM quotations q
      JOIN products p ON q.product_id = p.id
      WHERE q.user_id = ?
      ORDER BY q.created_at DESC
    `;

    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Gagal mengambil data pesanan" });
      }
      res.json(results);
    });
  });
};