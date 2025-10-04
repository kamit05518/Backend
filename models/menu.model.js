const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
  image: { type: String }
});


const MenuItem = mongoose.models.MenuItem || mongoose.model("Menu", MenuItemSchema);

module.exports = MenuItem;
