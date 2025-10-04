const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
    match: [/^\d{10}$/, 'Phone must be 10 digits']
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other'],
    lowercase: true
  },
  profileImage: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Profile", ProfileSchema);