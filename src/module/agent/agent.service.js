import ApiError from "../../utils/errorHandler/apiErrorHandler.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { AgentTransaction, CashRequisition } from "./agent.model.js";
import User from "../auth/auth.model.js";
import UserTransaction from "../user/use.model.js";

const sendMoney = async (payload) => {
  const session = await mongoose.startSession();
  const getReceiverData = await User.findOne({
    phone: payload.receiverPhone,
    role: "user",
  });

  if (!getReceiverData) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Receiver not found");
  }

  const getAgentInfo = await User.findById(payload.agentId);
  if (getAgentInfo.balance < payload.amount) {
    throw new ApiError(StatusCodes.PAYMENT_REQUIRED, "Insufficient balance");
  }

  session.startTransaction();

  try {
    const sender = await User.findById(payload.agentId).session(session);
    const receiver = await User.findById(getReceiverData._id).session(session);
    sender.balance -= payload.amount;
    await sender.save({ session });
    receiver.balance += payload.amount;

    await receiver.save({ session });

    await UserTransaction.create(
      [
        {
          transactionType: "cashIn",
          senderId: sender._id,
          receiverId: receiver._id,
          amount: payload.amount,
        },
      ],
      { session }
    );
    await AgentTransaction.create(
      [
        {
          transactionType: "sendMoney",
          senderId: sender._id,
          receiverId: receiver._id,
          amount: payload.amount,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return { result: "Cash in successful" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const cashRequisition = async (payload) => {
  const getAgentInfo = await User.findById(payload.agentId);
  if (getAgentInfo.balance < payload.amount) {
    throw new ApiError(StatusCodes.PAYMENT_REQUIRED, "Insufficient balance");
  }
  const result = await CashRequisition.create(payload);
  if (!result) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to create requisition"
    );
  }
  return { message: "Requisition created successfully" };
};

const getRequisition = async (payload) => {
  const result = await CashRequisition.find({
    agentId: payload.agentId,
    requisitionType: payload.requisitionType,
  });
  return result;
};

export const agentService = {
  sendMoney,
  cashRequisition,
  getRequisition,
};
