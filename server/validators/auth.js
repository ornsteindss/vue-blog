const Joi = require('joi');

const password = Joi.string().min(8).max(128).required().messages({
  'string.min': 'Password must be at least 8 characters',
  'string.max': 'Password must be at most 128 characters',
  'any.required': 'Password is required',
});

module.exports = {
  signup: Joi.object({
    name:     Joi.string().trim().min(2).max(64).required().messages({
      'string.min': 'Name must be at least 2 characters',
      'any.required': 'Name is required',
    }),
    email:    Joi.string().email({ tlds: false }).max(254).required().messages({
      'string.email': 'Must be a valid email address',
      'any.required': 'Email is required',
    }),
    password,
  }),

  login: Joi.object({
    email:    Joi.string().email({ tlds: false }).required().messages({
      'string.email': 'Must be a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({ 'any.required': 'Password is required' }),
  }),

  requestReset: Joi.object({
    email: Joi.string().email({ tlds: false }).required().messages({
      'string.email': 'Must be a valid email address',
      'any.required': 'Email is required',
    }),
  }),

  confirmReset: Joi.object({
    password,
  }),
};
