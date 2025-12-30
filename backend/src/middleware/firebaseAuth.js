const admin = require("firebase-admin");
const serviceAccount = require("../firebaseServiceAccount.json");

// Cek inisialisasi agar tidak error jika dipanggil berulang
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    
    // Simpan data user ke req.user agar bisa dibaca controller
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || decoded.email.split('@')[0], // Fallback nama jika kosong
      picture: decoded.picture || null
    };

    next();
  } catch (err) {
    console.error("Firebase Auth Error:", err); 
    res.status(401).json({ message: "Invalid or expired token" });
  }
};