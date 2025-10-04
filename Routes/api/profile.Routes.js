const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Profile = require('../../Controller/profile');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "..", "..", "uploads"); 
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `profile-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });


router.get("/", async (req, res) => {
  try {
    let profile = await Profile.findOne(); 
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    console.error("GET /api/profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/", upload.single("profileImage"), async (req, res) => {
  try {
    const { fullName, email, phone, dob, gender } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    let profile = await Profile.findOne({ email });

    const imagePath = req.file ? `/uploads/${req.file.filename}` : profile?.profileImage || null;

    if (profile) {
      // Update existing profile
      profile.fullName = fullName;
      profile.phone = phone;
      profile.dob = dob;
      profile.gender = gender;
      profile.profileImage = imagePath;
      await profile.save();
    } else {
      // Create new profile
      profile = new Profile({
        fullName,
        email,
        phone,
        dob,
        gender,
        profileImage: imagePath,
      });
      await profile.save();
    }

    res.json({ message: "Profile saved successfully", profile });

  } catch (error) {
    console.error("POST /api/profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
