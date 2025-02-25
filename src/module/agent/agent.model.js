import mongoose, { Schema, model } from "mongoose";

const agentTransactionSchema = new Schema(
  {
    transactionType: {
      type: String,
      enum: ["cashOut", "sendMoney", "bonus", "withdraw"],
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    receiverId: {
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

const AgentTransaction = model("agentTransaction", agentTransactionSchema);

export default AgentTransaction;
