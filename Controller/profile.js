const Profile = require("../models/Profile");
const path = require('path');
const fs = require('fs');


exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne().sort({ createdAt: -1 });
    
    if (!profile) {
      return res.status(200).json({
        fullName: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        profileImage: null
      });
    }

    const profileData = {
      ...profile.toObject(),
      profileImage: profile.profileImage 
        ? `${req.protocol}://${req.get('host')}/uploads/${profile.profileImage}` 
        : null
    };

    res.status(200).json(profileData);
  } catch (error) {
    console.error(' Error fetching profile:', error);
    res.status(500).json({ 
      message: 'Server error while fetching profile',
      error: error.message 
    });
  }
};

// POST - Create/Update Profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { fullName, email, phone, dob, gender } = req.body;

    // Basic validation
    if (!fullName || !email || !phone || !dob || !gender) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    // Email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        message: 'Invalid email format' 
      });
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        message: 'Phone must be 10 digits' 
      });
    }

    // Check if profile exists
    let profile = await Profile.findOne();

    const profileData = {
      fullName,
      email,
      phone,
      dob,
      gender
    };

    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (profile && profile.profileImage) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', profile.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      profileData.profileImage = req.file.filename;
    }

    if (profile) {
      // Update existing profile
      Object.assign(profile, profileData);
      await profile.save();
      
      const updatedProfile = {
        ...profile.toObject(),
        profileImage: profile.profileImage 
          ? `${req.protocol}://${req.get('host')}/uploads/${profile.profileImage}` 
          : null
      };

      return res.status(200).json(updatedProfile);
    } else {
      // Create new profile
      profile = new Profile(profileData);
      await profile.save();
      
      const newProfile = {
        ...profile.toObject(),
        profileImage: profile.profileImage 
          ? `${req.protocol}://${req.get('host')}/uploads/${profile.profileImage}` 
          : null
      };

      return res.status(201).json(newProfile);
    }
  } catch (error) {
    console.error(' Error saving profile:', error);
    
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Email already exists' 
      });
    }

    res.status(500).json({ 
      message: 'Server error while saving profile',
      error: error.message 
    });
  }
};

// DELETE - Delete Profile (Optional)
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    
    if (!profile) {
      return res.status(404).json({ 
        message: 'Profile not found' 
      });
    }

    // Delete image file
    if (profile.profileImage) {
      const imagePath = path.join(__dirname, '..', 'uploads', profile.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Profile.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ 
      message: 'Profile deleted successfully' 
    });
  } catch (error) {
    console.error(' Error deleting profile:', error);
    res.status(500).json({ 
      message: 'Server error while deleting profile',
      error: error.message 
    });
  }
};