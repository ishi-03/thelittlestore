import express from "express";
import { requireAdmin } from "../middleware/adminAuth.js";

import {
  getCategories,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// Get all active categories
router.get("/", getCategories);

// Admin: all categories including inactive
router.get("/admin/all", requireAdmin, getAllCategories);

// Create category
router.post("/", requireAdmin, createCategory);

// Update category (rename / activate / deactivate)
router.put("/:id", requireAdmin, updateCategory);

// Delete category
router.delete("/:id", requireAdmin, deleteCategory);

export default router;
