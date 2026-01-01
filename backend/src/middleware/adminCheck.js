const db = require("../config/db");

module.exports = (req, res, next) => {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const query = "SELECT role FROM users WHERE firebase_uid = ?";
  
  db.query(query, [req.user.uid], (err, results) => {
    if (err) return res.status(500).json({ message: "Database Error" });
    
    if (results.length === 0 || results[0].role !== 'admin') {
      return res.status(403).json({ message: "Access Denied: Admins Only" });
    }

    next();
  });
};