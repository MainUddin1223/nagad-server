import UserTransaction from "./use.model.js";
import ApiError from "../../utils/errorHandler/apiErrorHandler.js";
import { StatusCodes } from "http-status-codes";
import User from "../auth/auth.model.js";
import mongoose from "mongoose";

const getTransactions = async (_id) => {
  const transactions = await UserTransaction.find({
    userId: _id,
  });

  return transactions;
};

const getTransactionById = async (_id, userId) => {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid transaction ID");
  }

  const transaction = await UserTransaction.findOne({
    _id: new mongoose.Types.ObjectId(_id),
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
  if (getSenderInfo.balance < payload.amount) {
    throw new ApiError(StatusCodes.PAYMENT_REQUIRED, "Insufficient balance");
  }
  const transactionFee = payload.amount > 100 ? 5 : 0;

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

export const userService = {
  getTransactions,
  getTransactionById,
  sendMoney,
};
