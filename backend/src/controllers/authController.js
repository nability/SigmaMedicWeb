const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token tidak ditemukan" });
    }

    console.log("Token masuk:", token);
    console.log("Google ID:", process.env.GOOGLE_CLIENT_ID);

    // Verifikasi token Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    const googlePass = bcrypt.hashSync("GOOGLE_USER", 10);

    // Cek apakah user sudah ada
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (results.length === 0) {
        // Buat user baru jika belum ada
        db.query(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          [name, email, googlePass],
          (err2) => {
            if (err2) {
              console.log(err2);
              return res.status(500).json({ message: "DB error" });
            }
          }
        );
      }

      // Generate token JWT
      const jwtToken = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({ token: jwtToken });
    });
  } catch (err) {
    console.log("Google Login Error:", err); // DEBUG penting
    return res.status(400).json({ message: "Google login gagal" });
  }
};


// REGISTER
exports.register = (req, res) => {
  const { name, email, password } = req.body;

  const hashed = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashed],
    (err) => {
      if (err) return res.status(400).json(err);
      res.json({ message: "Register success" });
    }
  );
};

// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) throw err;
    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = results[0];

    if (!bcrypt.compareSync(password, user.password))
      return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login success", token, user });
  });
};
