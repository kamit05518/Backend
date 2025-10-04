const CartModel = require("../models/Cart.Model");
const MenuModel = require("../models/items");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");
    req.userId = decoded.id; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const saveCart = async (req, res) => {
  const { itemId, quantity } = req.body;
  if (!itemId || !quantity)
    return res
      .status(400)
      .json({ message: "itemId and quantity are required" });

  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    let cart = await CartModel.findOne({ userId });
    if (!cart) cart = new CartModel({ userId, items: [] });

    if (!Array.isArray(cart.items)) cart.items = [];
    cart.items = cart.items.filter((item) => item && item.itemId);

    const menuItem = await MenuModel.findById(itemId);
    if (!menuItem)
      return res.status(404).json({ message: "Menu item not found" });

    const existingIndex = cart.items.findIndex(
      (item) => item.itemId.toString() === itemId
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        itemId,
        name: menuItem.name,
        price: menuItem.price,
        category: menuItem.category,
        image: menuItem.imageUrl,
        quantity,
      });
    }

    await cart.save();
    return res.json({ message: "Item added to cart", cart });
  } catch (err) {
    console.error("Failed to save cart:", err);
    return res
      .status(500)
      .json({ message: "Failed to save cart", error: err.message || err });
  }
};

// Get cart items
const getCartItems = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    let cart = await CartModel.findOne({ userId });
    if (!cart) return res.json({ items: [] });

    if (!Array.isArray(cart.items)) cart.items = [];

    return res.json({ items: cart.items });
  } catch (err) {
    console.error("Failed to get cart:", err);
    return res
      .status(500)
      .json({ message: "Failed to get cart", error: err.message || err });
  }
};

// Update cart item 
const updateCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.params;
    const { quantity, specialInstructions } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Validate itemId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }

    // Validate quantity if provided
    if (quantity !== undefined && (isNaN(quantity) || quantity < 0)) {
      return res.status(400).json({
        message: "Quantity must be a positive number"
      });
    }

    // Find user's cart
    let cart = await CartModel.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    // Find the item in cart
    const itemIndex = cart.items.findIndex(item => 
      item.itemId.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        message: "Item not found in cart"
      });
    }

    // Update the item
    if (quantity !== undefined) {
      if (quantity === 0) {
        // Remove item if quantity is 0
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = quantity;
      }
    }

    if (specialInstructions !== undefined) {
      cart.items[itemIndex].specialInstructions = specialInstructions;
    }

    // Save updated cart
    await cart.save();

    return res.status(200).json({
      message: "Cart item updated successfully",
      cart
    });

  } catch (error) {
    console.error("Error updating cart item:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message || error
    });
  }
};

// Delete cart item
const deleteCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const itemId = req.params.itemId;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }

    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const initialItemCount = cart.items.length;

    // Remove the matching item
    cart.items = cart.items.filter(item => !item.itemId.equals(itemId));

    if (cart.items.length === initialItemCount) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    return res.status(200).json({ message: "Item removed from cart", cart });

  } catch (error) {
    return res.status(500).json({ message: "Error deleting item", error: error.message });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.userId;
    await CartModel.updateOne({ userId }, { $set: { items: [] } });
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error });
  }
};


module.exports = {
  authMiddleware,
  saveCart,
  getCartItems,
  updateCartItem,
  deleteCartItem,
  clearCart
};