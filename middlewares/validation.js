const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// Custom URL validation function
// const validateUrl = (value, helpers) => {
//   if (
//     !validator.isURL(value, {
//       protocols: ["http", "https"],
//       require_protocol: true,
//     })
//   ) {
//     return helpers.message(
//       "Invalid URL format. Must start with http:// or https://"
//     );
//   }
//   return value;
// };
const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// 1. clothingItem validaiton
const clothingItemValidation = celebrate({
  // clothing item body when item created
  body: Joi.object().keys({
    // item name is required str 2-30 char
    name: Joi.string().min(2).max(30).required().messages({
      "string.base": "Item name must be a string.",
      "string.empty": "Item name cannot be empty.",
      "string.min": "Item name must be at least 2 characters long.",
      "string.max": "Item name must not exceed 30 characters.",
      "any.required": "Item name is required.",
    }),
    // image URL required str URL format
    imageUrl: Joi.string().required().custom(validateUrl).messages({
      "string.base": "Image URL must be a string.",
      "string.empty": "Image URL cannot be empty.",
      "any.required": "Image URL is required.",
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

// 2. validate user info body when user created
const userValidation = celebrate({
  body: Joi.object().keys({
    // username str 2-30 char
    name: Joi.string().min(2).max(30).messages({
      "string.base": "Username must be a string.",
      "string.empty": "Username cannot be empty.",
      "string.min": "Username must be at least 2 characters long.",
      "string.max": "Username must not exceed 30 characters.",
    }),
    // useravatar required str URL format
    avatar: Joi.string().required().custom(validateUrl).messages({
      "string.base": "Avatar URL must be a string.",
      "string.empty": "Avatar URL cannot be empty.",
      "any.required": "Avatar URL is required.",
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    // email required str valid email format
    email: Joi.string().required().email().messages({
      "string.email": "Invalid email format.",
      "any.required": "Email is required.",
    }),
    // password required str
    password: Joi.string().required().messages({
      "string.empty": "Password cannot be empty.",
      "any.required": "Password is required.",
    }),
  }),
});

// 3. auth when user logs in
const authValidation = celebrate({
  body: Joi.object().keys({
    // email required str in email format
    email: Joi.string().required().email().messages({
      "string.email": "Invalid email format.",
      "any.required": "Email is required.",
    }),
    // password required str
    password: Joi.string().required().messages({
      "string.empty": "Password cannot be empty.",
      "any.required": "Password is required.",
    }),
  }),
});

// 4. user and clothing item IDs when they are accessed

const idValidation = celebrate({
  params: Joi.object().keys({
    // ID MUST be hexadecimal value length of 24 char
    id: Joi.string().length(24).hex().required().messages({
      "string.length": "ID must be exactly 24 characters long.",
      "string.hex": "ID must be a valid hexadecimal value.",
      "any.required": "ID is required.",
    }),
  }),
});

module.exports = {
  clothingItemValidation,
  userValidation,
  authValidation,
  idValidation,
};
