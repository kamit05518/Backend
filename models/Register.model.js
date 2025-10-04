const { model, Schema } = require("mongoose");

const RegisterSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,    
    trim: true          
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    match: /^\d{10}$/,
    required: true,
  },
  token: {
    type: String,
  },
  lastLogin: {
    type: Date,
  },
  resetOTP: {
    type: Number,
  },
  resetOTPExpiry: {
    type: Date,
  }
});

module.exports = model("register", RegisterSchema);
