const path = require("path"); 
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const productRoutes = require("./routes/productRoutes");
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/auth", require("./routes/authRoutes"));
app.use("/products", productRoutes);


app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
