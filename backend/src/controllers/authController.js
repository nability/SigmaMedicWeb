const db = require("../config/db").promise(); // Pastikan pakai .promise() jika pakai mysql2

exports.syncUser = async (req, res) => {
  // 1. Ambil data dari middleware (req.user)
  const { uid, email, name } = req.user; 

  try {
    // 2. Cek apakah user sudah ada?
    const [rows] = await db.query("SELECT * FROM users WHERE firebase_uid = ?", [uid]);

    if (rows.length > 0) {
      // User sudah ada, kita update saja 'last_login' (opsional) atau return sukses
      return res.status(200).json({ 
        message: "User synced (existing)", 
        user: rows[0] 
      });
    }

    // 3. Jika belum ada, Insert user baru
    const insertQuery = `
      INSERT INTO users (name, email, firebase_uid, role, created_at) 
      VALUES (?, ?, ?, 'user', NOW())
    `;
    
    await db.query(insertQuery, [name, email, uid]);

    // 4. Ambil data user yang baru dibuat untuk dikembalikan ke frontend
    const [newUser] = await db.query("SELECT * FROM users WHERE firebase_uid = ?", [uid]);

    res.status(201).json({ 
      message: "User synced (created)", 
      user: newUser[0] 
    });

  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ message: "Database synchronization failed" });
  }
};

exports.getUserProfile = async (req, res) => {
  const { uid } = req.user; // Dari middleware

  try {
    const [rows] = await db.query(
      "SELECT id, name, email, phone, address, role, created_at FROM users WHERE firebase_uid = ?", 
      [uid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};