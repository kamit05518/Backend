const { json } = require('express');
const Joi = require('joi');

const momsValidation=Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(0).required(),
      });

module.exports=momsValidation