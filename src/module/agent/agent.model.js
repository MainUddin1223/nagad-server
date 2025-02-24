import { Schema, model } from "mongoose";

const agentTransactionSchema = new Schema(
  {
    transactionType: {
      type: String,
      enum: ["cashIn", "cashOut", "bonus"],
    },
    agentId: {
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

const AgentTransaction = model("agentTransaction", agentTransactionSchema);

export default AgentTransaction;
