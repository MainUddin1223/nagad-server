import UserTransaction from "./use.model.js";
import ApiError from "../../utils/errorHandler/apiErrorHandler.js";
import { StatusCodes } from "http-status-codes";
import User from "../auth/auth.model.js";
import mongoose from "mongoose";
import AgentTransaction from "../agent/agent.model.js";
import { AdminTransaction } from "../admin/admin.model.js";

const getTransactions = async (userId) => {
  const transactions = await UserTransaction.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  });

  return transactions;
};

const getTransactionById = async (_id, userId) => {
  const transaction = await UserTransaction.findOne({
    _id,
    $or: [{ senderId: userId }, { receiverId: userId }],
  })
    .populate("senderId", "name phone")
    .populate("receiverId", "name phone");

  if (!transaction) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Transaction not found");
  }

  return transaction;
};

const sendMoney = async (payload) => {
  const session = await mongoose.startSession();
  const getReceiverData = await User.findOne({
    phone: payload.receiverPhone,
  });

  if (!getReceiverData) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Receiver not found");
  }

  if (getReceiverData.role == "agent" || getReceiverData.role == "admin") {
    throw new ApiError(
      StatusCodes.NOT_ACCEPTABLE,
      "You can send money to the agents"
    );
  }

  const getSenderInfo = await User.findById(payload.senderId);
  const transactionFee = payload.amount > 100 ? 5 : 0;
  if (getSenderInfo.balance < payload.amount + transactionFee) {
    throw new ApiError(StatusCodes.PAYMENT_REQUIRED, "Insufficient balance");
  }

  session.startTransaction();

  try {
    const sender = await User.findById(payload.senderId).session(session);
    const receiver = await User.findById(getReceiverData._id).session(session);
    if (sender.balance < payload.amount) {
      throw new ApiError(StatusCodes.PAYMENT_REQUIRED, "Insufficient balance");
    }
    sender.balance -= payload.amount + transactionFee;
    await sender.save({ session });
    receiver.balance += payload.amount;

    await receiver.save({ session });

    await UserTransaction.create(
      [
        {
          transactionType: "sendMoney",
          senderId: sender._id,
          receiverId: receiver._id,
          amount: payload.amount + transactionFee,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return { result: "Transaction successful" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const cashOut = async (payload) => {
  const { amount } = payload;
  const session = await mongoose.startSession();

  const getAgentData = await User.findOne({
    phone: payload.receiverPhone,
    role: "agent",
    isApproved: true,
  });

  if (!getAgentData) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Invalid agent number");
  }

  const getSenderInfo = await User.findById(payload.senderId);
  const agentFee = Number(((amount * 0.5) / 100).toFixed(2));
  const adminFee = Number(((amount * 1) / 100).toFixed(2));
  if (getSenderInfo.balance < amount + agentFee + adminFee) {
    throw new ApiError(StatusCodes.PAYMENT_REQUIRED, "Insufficient balance");
  }

  session.startTransaction();

  try {
    const sender = await User.findById(payload.senderId).session(session);
    const admin = await User.findOne({ role: "admin" }).session(session);
    const receiver = await User.findById(getAgentData._id).session(session);
    if (sender.balance < payload.amount) {
      throw new ApiError(StatusCodes.PAYMENT_REQUIRED, "Insufficient balance");
    }
    sender.balance -= amount + agentFee + adminFee;
    receiver.balance += amount + agentFee;
    admin.balance += amount + adminFee;

    await sender.save({ session });
    await admin.save({ session });
    await receiver.save({ session });

    await UserTransaction.create(
      [
        {
          senderId: sender._id,
          receiverId: receiver._id,
          amount: amount + agentFee + adminFee,
          transactionType: "cashOut",
        },
      ],
      { session }
    );
    await AgentTransaction.create(
      [
        {
          senderId: sender._id,
          receiverId: receiver._id,
          amount: amount + agentFee,
          transactionType: "cashOut",
        },
      ],
      { session }
    );
    await UserTransaction.create(
      [
        {
          senderId: sender._id,
          receiverId: receiver._id,
          amount: amount + agentFee + adminFee,
          transactionType: "cashOut",
        },
      ],
      { session }
    );
    await AdminTransaction.create(
      [
        {
          userId: sender._id,
          amount: adminFee,
          transactionType: "cashOutFee",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return { result: "Cash Out successful" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const userService = {
  getTransactions,
  getTransactionById,
  sendMoney,
  cashOut,
};
