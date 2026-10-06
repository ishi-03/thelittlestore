import express from "express";
import { requireAdmin } from "../middleware/adminAuth.js";
import { getProducts, getProductById, createProduct,updateProduct,deleteProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", requireAdmin, createProduct);
router.put("/:id", requireAdmin, updateProduct);
router.delete("/:id", requireAdmin, deleteProduct);

export default router;