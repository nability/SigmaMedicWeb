const admin = require("firebase-admin");
const serviceAccount = require("../firebaseServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);

  req.user = {
    uid: decoded.uid,
    email: decoded.email,
    name: decoded.name || decoded.email
  };

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
