const db = require("../config/db").promise(); // Pastikan pakai .promise()

// 1. Sync User (Login/Register)
exports.syncUser = async (req, res) => {
  const { uid, email, name } = req.user; 

  try {
    // Cek user existing
    const [rows] = await db.query("SELECT * FROM users WHERE firebase_uid = ?", [uid]);

    if (rows.length > 0) {
      return res.status(200).json({ 
        message: "User synced (existing)", 
        user: rows[0] 
      });
    }

    // Insert user baru
    const insertQuery = `
      INSERT INTO users (name, email, firebase_uid, role, created_at) 
      VALUES (?, ?, ?, 'user', NOW())
    `;
    
    await db.query(insertQuery, [name || 'User', email, uid]);

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

// 2. Get User Profile (Single User)
exports.getUserProfile = async (req, res) => {
  const { uid } = req.user; 

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
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// 3. [ADMIN] Ambil Semua User (DIPERBAIKI)
exports.getAllUsers = async (req, res) => {
  try {
    // 🔥 UBAH JADI ASYNC/AWAIT
    const [rows] = await db.query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Gagal ambil users:", err);
    res.status(500).json({ message: "Database Error" });
  }
};

// 4. [ADMIN] Ganti Role User (DIPERBAIKI)
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body; 
  
  try {
    // 🔥 UBAH JADI ASYNC/AWAIT
    await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
    res.json({ message: "Role user berhasil diubah" });
  } catch (err) {
    console.error("Gagal update role:", err);
    res.status(500).json({ message: "Gagal update role" });
  }
};