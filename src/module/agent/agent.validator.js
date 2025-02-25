import Joi from "joi";

export const cashInUserValidationSchema = Joi.object({
  amount: Joi.number().min(10).required().messages({
    "number.base": "Amount must be a number",
    "number.min": "Amount must be at least 10",
    "any.required": "Amount is required",
  }),
  receiverPhone: Joi.string()
    .required()
    .pattern(/^(\+8801)[0-9]{9}$/)
    .messages({
      "string.pattern.base":
        "The phone number must be 14 digits and start with +880.",
      "any.required": "Receiver Phone number is required",
    }),
});

export const transactionValidationSchema = Joi.object({
  amount: Joi.number().min(10).required().messages({
    "number.base": "Amount must be a number",
    "number.min": "Amount must be at least 10",
    "any.required": "Amount is required",
  }),
  requisitionType: Joi.string()
    .valid("cashIn", "withdraw")
    .required()
    .messages({
      "any.only": "Requisition type must be either 'cashIn' or 'withdraw'",
      "any.required": "Requisition type is required",
    }),
});
