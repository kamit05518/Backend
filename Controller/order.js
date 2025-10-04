const OrderModel = require("../models/order.model");

const order = async (req, res) => {
  try {
    // Add userId to the order data from the authenticated user
    const orderData = {
      ...req.body,
      userId: req.userId 
    };
    
    const newOrder = new OrderModel(orderData);
    const saved = await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: saved });
  } catch (err) {
    console.error("Order placement error:", err);
    res.status(500).json({ message: "Error placing order", error: err.message });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    console.log("Fetching orders for user:", userId);
    
    const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 });
    
    console.log("Found orders:", orders.length);
    
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }
    
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.userId;
    
    const order = await OrderModel.findOne({ _id: orderId, userId });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "Error fetching order", error: err.message });
  }
};

module.exports = { order, getAllOrder, getOrderById };

