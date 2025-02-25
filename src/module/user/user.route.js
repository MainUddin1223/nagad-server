import express from "express";
import { verifyAuth } from "../../utils/authHelper/verifyAuth.js";
import { userController } from "./user.controller.js";
const router = express.Router();

router.route("/transactions").get(verifyAuth, userController.getTransactions);
router.route("/send-money").post(verifyAuth, userController.sendMoney);
router
  .route("/transactions/:_id")
  .get(verifyAuth, userController.getTransactionById);

export default { userRouter: router };
