const Joi = require('joi');

/**
 * User Model
 */
const user = Joi.object({
  email: Joi.string().email().required(),
  givenName: Joi.string().required(),
  familyName: Joi.string().required(),
});

module.exports = user;
