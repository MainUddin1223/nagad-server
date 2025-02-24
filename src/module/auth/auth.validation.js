import Joi from "joi";

export const registerValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.pattern.base": "Please enter a valid name",
    "any.required": "Name is required",
  }),
  email: Joi.string()
    .pattern(new RegExp("^\\S+@\\S+\\.\\S+$"))
    .required()
    .messages({
      "string.pattern.base": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
  role: Joi.string().valid("user", "agent").required().messages({
    "any.required": "role field is required",
    "any.only": 'role field must be one of "user", "agent"',
  }),
  password: Joi.string()
    .length(5)
    .pattern(/^[0-9]{5}$/)
    .required()
    .messages({
      "string.length": "Password must be exactly {#limit} digits long",
      "string.pattern.base":
        "Password must contain only numbers (0-9) and no special characters",
      "any.required": "Password is required",
    }),
  confirmPassword: Joi.string()
    .length(5)
    .pattern(/^[0-9]{5}$/)
    .required()
    .messages({
      "string.length": "Confirm password must be exactly {#limit} digits long",
      "string.pattern.base":
        "Confirm password must contain only numbers (0-9) and no special characters",
      "any.required": "Confirm password is required",
    }),
  phone: Joi.string()
    .optional()
    .pattern(/^(\+88)[0-9]{11}$/)
    .messages({
      "string.pattern.base":
        "The phone number must be 14 digits and start with +880.",
    }),
});

export const loginValidationSchema = Joi.object({
  phone: Joi.string()
    .optional()
    .pattern(/^(\+88)[0-9]{11}$/)
    .messages({
      "string.pattern.base":
        "The phone number must be 14 digits and start with +880.",
    }),
  password: Joi.string()
    .length(5)
    .pattern(/^[0-9]{5}$/)
    .required()
    .messages({
      "string.length": "Password must be exactly {#limit} digits long",
      "string.pattern.base":
        "Password must contain only numbers (0-9) and no special characters",
      "any.required": "Password is required",
    }),
});
