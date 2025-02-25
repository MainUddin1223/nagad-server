import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/responseHandler/responseHandler.js";
import catchAsync from "../../utils/errorHandler/catchAsyncHandler.js";
import { userService } from "./user.service.js";

const getTransactions = catchAsync(async (req, res) => {
  const result = await userService.getTransactions(req.user._id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Transaction retrieved successfully",
    data: result,
  });
});

export const userController = {
  getTransactions,
};
