const path = require("path");
const fs = require("fs");
const Profile = require("../models/Profile");

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne().sort({ createdAt: -1 });
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const fullImageUrl = profile.profileImage
      ? `${req.protocol}://${req.get("host")}/uploads/${profile.profileImage}`
      : null;

    res.json({ 
      ...profile.toObject(), 
      profileImage: fullImageUrl 
    });
  } catch (error) {
    console.error("GET profile error:", error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
};

// Create or update profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { fullName, email, phone, dob, gender } = req.body;

    // Validation
    if (!fullName || !email) {
      if (req.file) {
        fs.unlinkSync(req.file.path); 
      }
      return res.status(400).json({ 
        message: "Full name and email are required" 
      });
    }

    // Email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        message: "Invalid email format" 
      });
    }

    let profile = await Profile.findOne({ email });

    // Handle new image upload
    let imageFilename = profile?.profileImage || null;
    
    if (req.file) {
      // Delete old image if exists
      if (profile && profile.profileImage) {
        const oldImagePath = path.join(__dirname, "..", "uploads", profile.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageFilename = req.file.filename;
    }

    if (profile) {
      // Update existing profile
      profile.fullName = fullName;
      profile.phone = phone;
      profile.dob = dob;
      profile.gender = gender;
      profile.profileImage = imageFilename;
      await profile.save();
      
      const fullImageUrl = imageFilename
        ? `${req.protocol}://${req.get("host")}/uploads/${imageFilename}`
        : null;

      return res.json({ 
        message: "Profile updated successfully", 
        profile: { 
          ...profile.toObject(), 
          profileImage: fullImageUrl 
        } 
      });
    } else {
      // Create new profile
      profile = new Profile({
        fullName,
        email,
        phone,
        dob,
        gender,
        profileImage: imageFilename,
      });
      await profile.save();
      
      const fullImageUrl = imageFilename
        ? `${req.protocol}://${req.get("host")}/uploads/${imageFilename}`
        : null;

      return res.status(201).json({ 
        message: "Profile created successfully", 
        profile: { 
          ...profile.toObject(), 
          profileImage: fullImageUrl 
        } 
      });
    }
  } catch (error) {
    console.error("Create/Update profile error:", error);
    
    // Delete uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Email already exists" 
      });
    }

    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Delete profile
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    
    if (!profile) {
      return res.status(404).json({ 
        message: "Profile not found" 
      });
    }

    // Delete image file
    if (profile.profileImage) {
      const imagePath = path.join(__dirname, "..", "uploads", profile.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Profile.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: "Profile deleted successfully" 
    });
  } catch (error) {
    console.error("Delete profile error:", error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
};