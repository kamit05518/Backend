// controller file
const orderModel = require("../models/order.model");

exports.getOrderStatus = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await orderModel.findOne({ orderId }); 

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    
    return res.status(200).json({
      orderId: order.orderId,
      step: order.step,
      items: order.items,
      totalPrice: order.totalPrice
    });
  } catch (error) {
    console.error("Error fetching order status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
