const bcrypt = require('bcryptjs');
const sendEmail = require('../untils/sendEmail');
const RegisterModel = require('../models/Register.model');


exports.sendOTP = async (req, res) => {
    try {
        console.log('1. Jo email request mein aaya hai:', req.body.email); // Jo email frontend se aa raha hai
        
        const email = req.body.email.trim().toLowerCase();
        
        console.log('2. Email trim aur lowercase karne ke baad:', email); // Jo email database mein khoja ja raha hai

        const user = await RegisterModel.findOne({ email });

        if (!user) {
            console.log('3. Database mein user nahi mila is email ke liye:', email); // Agar user nahi milta hai
            return res.status(404).json({ message: 'If a user with that email exists, an OTP has been sent.' });
        }
        
        console.log('3. Database mein user mil gaya is email ke liye:', user.email); // Agar user mil gaya

        const otp = Math.floor(100000 + Math.random() * 900000);
        user.resetOTP = otp;
        user.resetOTPExpiry = Date.now() + 15 * 60 * 1000;
        await user.save();

        await sendEmail(email, 'Your OTP Code', `Your OTP is ${otp}`);
        res.json({ message: 'If a user with that email exists, an OTP has been sent.' });

    } catch (error) {
        console.error('sendOTP mein error hai:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};


exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        // Trim whitespace and convert to lowercase for consistent database lookup
        const user = await RegisterModel.findOne({ email: email.trim().toLowerCase() });

        // Check for user existence, valid OTP, and if the OTP has expired
        if (!user || user.resetOTP !== parseInt(otp) || Date.now() > user.resetOTPExpiry) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        // Hash the new password before saving it
        user.password = await bcrypt.hash(newPassword, 10);
        // Clear OTP fields to prevent reuse
        user.resetOTP = undefined;
        user.resetOTPExpiry = undefined;
        await user.save();

        res.json({ message: 'Password reset successful.' });
    } catch (error) {
        // Log the error for internal debugging
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};