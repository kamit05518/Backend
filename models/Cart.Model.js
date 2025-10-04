const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Register", required: true },
    items: [
      {
        itemId: { type: Schema.Types.ObjectId, ref: "Menu", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        image: { type: String},
      },
    ],
    totalPrice: { type: Number, required: true, default: 0 },
   
  },
  { timestamps: true }
);

module.exports = model("Cart", CartSchema);
