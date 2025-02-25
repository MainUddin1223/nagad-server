import catchAsync from "../../utils/errorHandler/catchAsyncHandler.js";
import sendResponse from "../../utils/responseHandler/responseHandler.js";
import { agentService } from "./agent.service.js";
import {
  cashInUserValidationSchema,
  transactionValidationSchema,
} from "./agent.validator.js";
import { StatusCodes } from "http-status-codes";

const cashInUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const { error } = cashInUserValidationSchema.validate(req.body);
  if (error) {
    sendResponse(res, {
      statusCode: StatusCodes.NOT_ACCEPTABLE,
      success: false,
      message: error.details[0]?.message,
      data: error.details,
    });
  } else {
    const result = await agentService.sendMoney({
      ...payload,
      agentId: req.user._id,
    });
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Cash in successful",
      data: result,
    });
  }
});
const cashRequisition = catchAsync(async (req, res) => {
  const payload = req.body;
  const { error } = transactionValidationSchema.validate(req.body);
  if (error) {
    sendResponse(res, {
      statusCode: StatusCodes.NOT_ACCEPTABLE,
      success: false,
      message: error.details[0]?.message,
      data: error.details,
    });
  } else {
    const result = await agentService.cashRequisition({
      ...payload,
      agentId: req.user._id,
    });
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Cash in successful",
      data: result,
    });
  }
});

const getCashRequisition = catchAsync(async (req, res) => {
  const requisitionType = req.query.type;
  if (requisitionType == "cashIn" || requisitionType == "withdraw") {
    const result = await agentService.getRequisition({
      requisitionType,
      agentId: req.user._id,
    });
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Requisition data retrieved successfully",
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: StatusCodes.NOT_ACCEPTABLE,
      success: false,
      message: "Invalid requisition type",
      data: "Invalid requisition type",
    });
  }
});

export const agentController = {
  cashInUser,
  cashRequisition,
  getCashRequisition,
};
