const Joi = require('joi');

module.exports = {
  create: Joi.object({
    body:     Joi.string().trim().min(1).max(2000).required().messages({
      'string.min': 'Comment cannot be empty',
      'string.max': 'Comment is too long (max 2 000 characters)',
      'any.required': 'Comment body is required',
    }),
    postSlug: Joi.string().required().messages({
      'any.required': 'Post slug is required',
    }),
  }),
};
