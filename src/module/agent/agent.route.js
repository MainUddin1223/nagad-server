import express from "express";
import { verifyAuth } from "../../utils/authHelper/verifyAuth.js";
import { userController } from "../user/user.controller.js";
import { agentController } from "./agent.controller.js";
const router = express.Router();

router.route("/cash-in").post(verifyAuth, agentController.cashInUser);
router.route("/transaction").get(verifyAuth, userController.getTransactions);
router
  .route("/transaction/:_id")
  .get(verifyAuth, userController.getTransactionById);

export default { agentRouter: router };
