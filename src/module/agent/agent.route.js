import express from "express";
import { verifyAgent, verifyAuth } from "../../utils/authHelper/verifyAuth.js";
import { userController } from "../user/user.controller.js";
import { agentController } from "./agent.controller.js";
const router = express.Router();

router.route("/cash-in").post(verifyAgent, agentController.cashInUser);
router
  .route("/cash-requisition")
  .post(verifyAgent, agentController.cashRequisition)
  .get(verifyAgent, agentController.getCashRequisition);
router.route("/transaction").get(verifyAuth, userController.getTransactions);
router
  .route("/transaction/:_id")
  .get(verifyAuth, userController.getTransactionById);

export default { agentRouter: router };
