const Joi = require('joi');

module.exports = {
  create: Joi.object({
    title: Joi.string().trim().min(3).max(200).required().messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title must be at most 200 characters',
      'any.required': 'Title is required',
    }),
    body: Joi.string().trim().min(10).max(50000).required().messages({
      'string.min': 'Post body must be at least 10 characters',
      'string.max': 'Post body is too long (max 50 000 characters)',
      'any.required': 'Post body is required',
    }),
  }),

  update: Joi.object({
    title: Joi.string().trim().min(3).max(200).messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title must be at most 200 characters',
    }),
    body: Joi.string().trim().min(10).max(50000).messages({
      'string.min': 'Post body must be at least 10 characters',
      'string.max': 'Post body is too long (max 50 000 characters)',
    }),
  }).min(1).messages({ 'object.min': 'Provide at least one field to update' }),
};
