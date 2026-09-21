import express from "express";

import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// Get all active categories
router.get("/", getCategories);

// Create category
router.post("/", createCategory);

// Delete category
router.delete("/:id", deleteCategory);

export default router;