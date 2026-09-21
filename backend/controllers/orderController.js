import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    // Check stock first
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} does not have enough stock`,
        });
      }
    }

    // Create order
    const order = await Order.create({
      items,
      totalAmount,
      status: "paid",
    });

    // Reduce inventory
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: -item.quantity,
          },
        },
        { new: true }
      );
    }

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to place order",
    });
  }
};