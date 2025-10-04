const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,   //  Gmail address
        pass: process.env.EMAIL_PASS,   // App password 
    },
});

const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: `"Your App Name" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });

        console.log(' Email sent: ' + info.response);
    } catch (error) {
        console.error(' Error sending email:', error);
        throw error;
    }
};

module.exports = sendEmail;
