import Category from "../models/Category.js";
import Product from "../models/Product.js";

// GET ALL CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    }).sort({ name: 1 });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL CATEGORIES (admin, includes inactive)
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE CATEGORY (rename and/or activate/deactivate)
export const updateCategory = async (req, res) => {
  try {
    const { name, isActive } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const oldName = category.name;

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({ message: "Category name is required" });
      }
      category.name = String(name).trim();
    }
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    await category.save();

    // products store the category name as text, keep them in sync on rename
    if (category.name !== oldName) {
      await Product.updateMany({ category: oldName }, { $set: { category: category.name } });
    }

    res.status(200).json(category);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ message: "Category already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// CREATE CATEGORY
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const category = await Category.create({
      name: name.trim(),
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE CATEGORY
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};