const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const firebaseAuth = require("../middleware/firebaseAuth");

router.post(
  "/sync-user",
  firebaseAuth,
  authController.syncUser
);

router.get('/me', firebaseAuth, authController.getUserProfile);


module.exports = router;
