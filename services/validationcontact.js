const Joi = require("joi");

const momsValidation = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name should have at least 2 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
  }),
  message: Joi.string().min(5).required().messages({
    "string.empty": "Message is required",
    "string.min": "Message should be at least 5 characters long",
  }),
});

module.exports = momsValidation;
