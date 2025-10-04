const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const RegisterModel = require("../models/Register.model");
const momsValidation = require("../services/validationloginSchema");

const Login = async (req, res) => {
  try {
    const order = await momsValidation.validateAsync(req.body);
    console.log("order received", order);

    const userExist = await RegisterModel.findOne({ email: order.email });
    console.log("userExist", userExist);

    if (!userExist) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const isPasswordMatch = await bcrypt.compare(
      order.password,
      userExist.password
    );
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    userExist.lastLogin = new Date();
    await userExist.save();

    const token = jwt.sign(
      { id: userExist._id, email: userExist.email },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    return res.status(200).json({
      message: "User Login successfully",
      token,
      user: {
        _id: userExist._id,
        email: userExist.email,
        name: userExist.name || "",
        phoneNumber: userExist.phoneNumber || "",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = Login;
