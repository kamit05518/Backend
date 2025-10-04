const mongoose = require("mongoose");

const chefSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String }, 
  photo: { type: String }, 
  experience:{type:Number},
  
}, {
  timestamps: true,
});

const Chef = mongoose.model("chef", chefSchema);

module.exports = Chef;
