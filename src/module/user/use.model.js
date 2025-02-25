import mongoose, { Schema, model } from "mongoose";

const userTransactionSchema = new Schema(
  {
    transactionType: {
      type: String,
      enum: ["cashIn", "cashOut", "bonus", "sendMoney"],
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserTransaction = model("userTransaction", userTransactionSchema);

export default UserTransaction;
