import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import ageGroupRoutes from "./routes/ageGroupRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: "https://thelittlestore.onrender.com"
}));app.use(express.json());

// Serve uploaded images statically -> http://localhost:5000/uploads/xyz.jpg
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/age-groups", ageGroupRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});