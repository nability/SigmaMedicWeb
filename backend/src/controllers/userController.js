exports.syncUser = (req, res) => {
  const { uid, email, name } = req.firebaseUser;

  db.query(
    "SELECT * FROM users WHERE firebase_uid = ?",
    [uid],
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (results.length === 0) {
        db.query(
          "INSERT INTO users (name, email, firebase_uid, role) VALUES (?, ?, ?, ?)",
          [name || "User", email, uid, "user"],
          (err2) => {
            if (err2)
              return res.status(500).json({ message: "Insert gagal" });

            return res.json({ message: "User synced (new)" });
          }
        );
      } else {
        return res.json({ message: "User already exists" });
      }
    }
  );
};
