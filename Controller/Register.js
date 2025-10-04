const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const momsValidation = require("../services/validationregisterSchema");
const RegisterModel = require("../models/Register.model");

const Register = async (req, res) => {
  try {
    
    const validatedData = await momsValidation.validateAsync(req.body);
    console.log("Validated data:", validatedData);

   
    const userExist = await RegisterModel.findOne({ email: validatedData.email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

   
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

   
    const token = jwt.sign(
      { email: validatedData.email }, 
      process.env.JWT_SECRET || "mysecretkey", 
      { expiresIn: "1h" }
    );

    // Create and save user in DB with token & lastLogin
    const newUser = new RegisterModel({
      email: validatedData.email,
      password: hashedPassword,
      phoneNumber: validatedData.phoneNumber,
      token: token,
      lastLogin: new Date(),
    });

    await newUser.save();

    //  Send response without password
    res.status(201).json({
      message: "User registered successfully",
      token: token,
      user: {
        _id: newUser._id,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        lastLogin: newUser.lastLogin,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = Register;
