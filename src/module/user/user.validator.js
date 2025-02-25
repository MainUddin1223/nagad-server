import Joi from "joi";

export const sendMoneyValidationSchema = Joi.object({
  amount: Joi.number().min(50).max(25000).required().messages({
    "number.base": "Amount must be a number",
    "number.min": "Amount must be at least 50",
    "number.max": "Amount cannot exceed 25,000",
    "any.required": "Amount is required",
  }),
  receiverPhone: Joi.string()
    .optional()
    .pattern(/^(\+8801)[0-9]{9}$/)
    .messages({
      "string.pattern.base":
        "The phone number must be 14 digits and start with +880.",
      "any.required": "Receiver Phone number is required",
    }),
});
