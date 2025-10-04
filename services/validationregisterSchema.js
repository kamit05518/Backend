const { json } = require('express');
const Joi = require('joi');

const momsValidation=Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
});

module.exports=momsValidation