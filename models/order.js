const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  step: { type: Number, default: 0 },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  placedAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date },
});

module.exports = mongoose.model("Order", orderSchema);
