const path = require("path"); 
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// === IMPORT ROUTES ===
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const rfqRoutes = require("./routes/rfqRoutes"); // 🔥 TAMBAHAN BARU 1

app.use(cors());
app.use(express.json());

// Folder static untuk gambar
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// === USE ROUTES ===
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/rfq", rfqRoutes); // 🔥 TAMBAHAN BARU 2: Agar endpoint /rfq bisa diakses

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});