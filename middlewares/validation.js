const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// 1. Validate Clothing Item Creation
module.exports.validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": "Name must be at least 2 characters long.",
      "string.max": "Name must be at most 30 characters long.",
      "any.required": "Name is required.",
    }),
    imageUrl: Joi.string()
      .custom((value, helpers) => {
        if (!validator.isURL(value)) {
          return helpers.message("Image must be a valid URL.");
        }
        return value;
      })
      .required()
      .messages({
        "any.required": "Image URL is required.",
      }),
    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "any.only": "Weather must be one of: hot, warm, or cold.",
      "any.required": "weather is required.",
    }),
  }),
});

// 2. Validate User Creation
module.exports.validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": "Name must be at least 2 characters long.",
      "string.max": "Name must be at most 30 characters long.",
    }),
    avatar: Joi.string()
      .custom((value, helpers) => {
        if (!validator.isURL(value)) {
          return helpers.message("Avatar must be a valid URL.");
        }
        return value;
      })
      .required()
      .messages({
        "any.required": "Avatar URL is required.",
      }),
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format.",
      "any.required": "Email is required.",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required.",
    }),
  }),
});

// 3. Validate Login Credentials
module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format.",
      "any.required": "Email is required.",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required.",
    }),
  }),
});

// 4. Validate IDs (e.g., User & Clothing Item IDs)
module.exports.validateId = celebrate({
  // use params to extract and validate item and user IDs
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required().messages({
      "string.length": "ID must be exactly 24 characters long.",
      "string.hex": "ID must be a valid hexadecimal value.",
      "any.required": "ID is required.",
    }),
  }),
});

// 5. Validate Updating User Profile
module.exports.validateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": "Name must be at least 2 characters long.",
      "string.max": "Name must be at most 30 characters long.",
    }),
    avatar: Joi.string()
      .custom((value, helpers) => {
        if (!validator.isURL(value)) {
          return helpers.message("Avatar must be a valid URL.");
        }
        return value;
      })
      .required()
      .messages({
        "any.required": "Avatar URL is required.",
      }),
  }),
});
