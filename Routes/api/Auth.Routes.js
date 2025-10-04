const Router = require("express").Router();
const Register = require("../../Controller/Register");
const login = require("../../Controller/Login");
const contact = require("../../Controller/contact.js")
const { sendOTP, resetPassword } = require("../../Controller/authController.js");


Router.post("/contact",contact);
Router.post("/register", Register);
Router.post("/login", login);
Router.post('/forgot-password', sendOTP);
Router.post('/reset-password', resetPassword);

module.exports = Router;
