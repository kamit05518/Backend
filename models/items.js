const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  subcategory: { type: String, required: true },
  image: { type: String },
  discount: { type: Number, default: 0 },
  time: { type: Number } 
});

module.exports = mongoose.model("item", menuSchema);
