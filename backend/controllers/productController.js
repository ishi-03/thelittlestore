import Product from "../models/Product.js";

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      availableAges,
      images,
      color,
      price,
      variants,
      isActive,
    } = req.body;

    // Basic validation
    if (!name || !category || price === undefined) {
      return res.status(400).json({
        message: "Name, category and price are required",
      });
    }

    // Validate variants
    if (variants && Array.isArray(variants)) {
      for (const variant of variants) {
        if (!variant.age) {
          return res.status(400).json({
            message: "Age is required for every variant",
          });
        }

        if (
          variant.stock === undefined ||
          Number(variant.stock) < 0
        ) {
          return res.status(400).json({
            message: "Valid stock is required for every variant",
          });
        }
      }
    }

    const product = await Product.create({
      name,
      description,
      category,
      availableAges,
      images,
      color,
      price,
      variants,
      isActive,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      availableAges,
      images,
      color,
      price,
      variants,
      isActive,
    } = req.body;

    // Validate variants
    if (variants && Array.isArray(variants)) {
      for (const variant of variants) {
        if (!variant.age) {
          return res.status(400).json({
            message: "Age is required for every variant",
          });
        }

        if (
          variant.stock === undefined ||
          Number(variant.stock) < 0
        ) {
          return res.status(400).json({
            message: "Valid stock is required for every variant",
          });
        }
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        category,
        availableAges,
        images,
        color,
        price,
        variants,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};