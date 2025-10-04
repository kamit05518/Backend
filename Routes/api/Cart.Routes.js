const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  saveCart,
  getCartItems,
  updateCartItem, 
  deleteCartItem,
  clearCart
} = require("../../Controller/cart");



router.post("/cart", authMiddleware, saveCart);
router.get("/cart", authMiddleware, getCartItems);
router.put("/cart/item/:itemId", authMiddleware, updateCartItem); 
router.delete("/cart/item/:itemId", authMiddleware, deleteCartItem);
router.delete("/cart", authMiddleware, clearCart);

module.exports = router;