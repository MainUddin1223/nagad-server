import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/responseHandler/responseHandler.js";
import catchAsync from "../../utils/errorHandler/catchAsyncHandler.js";
import { userService } from "./user.service.js";
import ApiError from "../../utils/errorHandler/apiErrorHandler.js";
import { sendMoneyValidationSchema } from "./user.validator.js";

const getTransactions = catchAsync(async (req, res) => {
  const result = await userService.getTransactions(req.user._id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Transactions retrieved successfully",
    data: result,
  });
});

const getTransactionById = catchAsync(async (req, res) => {
  const transactionId = req.params._id;
  const result = await userService.getTransactionById(
    transactionId,
    req.user._id
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Transaction details retrieved successfully",
    data: result,
  });
});

const sendMoney = catchAsync(async (req, res) => {
  const payload = req.body;
  const { error } = sendMoneyValidationSchema.validate(payload);
  if (error) {
    sendResponse(res, {
      statusCode: StatusCodes.NOT_ACCEPTABLE,
      success: false,
      message: error.details[0]?.message,
      data: error.details,
    });
  }

  const result = await userService.sendMoney({
    ...payload,
    senderId: req.user._id,
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Money sent successfully",
    data: result,
  });
});
const cashOut = catchAsync(async (req, res) => {
  const payload = req.body;
  const { error } = sendMoneyValidationSchema.validate(payload);
  if (error) {
    sendResponse(res, {
      statusCode: StatusCodes.NOT_ACCEPTABLE,
      success: false,
      message: error.details[0]?.message,
      data: error.details,
    });
  }

  const result = await userService.cashOut({
    ...payload,
    senderId: req.user._id,
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Cash out successful",
    data: result,
  });
});

export const userController = {
  getTransactions,
  getTransactionById,
  sendMoney,
  cashOut,
};
