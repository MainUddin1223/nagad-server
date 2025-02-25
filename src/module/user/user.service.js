import mongoose from "mongoose";
import UserTransaction from "./use.model.js";

const getTransactions = async (_id) => {
  const transactions = await UserTransaction.find({
    userId: _id,
  });

  return transactions;
};

const getTransactionById = async (_id, userId) => {
  const transactions = await UserTransaction.find({
    userId: _id,
  });

  return transactions;
};
const cashOut = async (userId, amount) => {
  const transactions = await UserTransaction.find({
    userId: _id,
  });

  return transactions;
};

export const userService = {
  getTransactions,
};
