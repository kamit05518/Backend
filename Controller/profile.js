const path = require("path");
const Profile = require("../models/Profile");

exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    console.error("GET /api/profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { fullName, email, phone, dob, gender } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    let profile = await Profile.findOne({ email });

    const imagePath = req.file ? `/uploads/${req.file.filename}` : profile?.profileImage || null;

    if (profile) {
      // Update
      profile.fullName = fullName;
      profile.phone = phone;
      profile.dob = dob;
      profile.gender = gender;
      profile.profileImage = imagePath;
      await profile.save();
    } else {
      // Create
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
};
