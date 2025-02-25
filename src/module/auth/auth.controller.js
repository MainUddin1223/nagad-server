import catchAsync from "../../utils/errorHandler/catchAsyncHandler.js";
import sendResponse from "../../utils/responseHandler/responseHandler.js";
import { authService } from "./auth.service.js";
import {
  loginValidationSchema,
  registerValidationSchema,
} from "./auth.validation.js";
import { StatusCodes } from "http-status-codes";

const registerUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const { error } = registerValidationSchema.validate(req.body);
  if (error) {
    sendResponse(res, {
      statusCode: StatusCodes.NOT_ACCEPTABLE,
      success: false,
      message: error.details[0]?.message,
      data: error.details,
    });
  } else if (req.body?.password !== req.body?.confirmPassword) {
    sendResponse(res, {
      statusCode: StatusCodes.NOT_ACCEPTABLE,
      success: false,
      message: "Confirm password not matched",
      data: "Confirm password not matched",
    });
  } else {
    const result = await authService.signUpUser(payload);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Sign up successful",
      data: result,
    });
  }
});

const loginUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const { error } = loginValidationSchema.validate(req.body);
  if (error) {
    sendResponse(res, {
      statusCode: StatusCodes.NOT_ACCEPTABLE,
      success: false,
      message: error.details[0]?.message,
      data: error.details,
    });
  } else {
    const result = await authService.loginUser(payload);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Login successful",
      data: result,
    });
  }
});

const auth = catchAsync(async (req, res) => {
  const result = await authService.getAuthInfo(req.user._id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Data Retrieved successfully",
    data: result,
  });
});

export const authController = { registerUser, loginUser, auth };
