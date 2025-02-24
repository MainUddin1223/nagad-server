import { Schema, model } from "mongoose";

const financialStatement = new Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    requestType: {
      type: String,
      enum: ["cashIn", "cashOut"],
    },
  },
  {
    timestamps: true,
  }
);

const FinancialStatement = model("financialStatement", financialStatement);

export default FinancialStatement;
