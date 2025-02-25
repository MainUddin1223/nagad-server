import express from "express";
import { verifyAuth, verifyUser } from "../../utils/authHelper/verifyAuth.js";
import { userController } from "./user.controller.js";
const router = express.Router();

router.route("/transactions").get(verifyAuth, userController.getTransactions);
router.route("/send-money").post(verifyUser, userController.sendMoney);
router.route("/cash-out").post(verifyUser, userController.cashOut);
router
  .route("/transactions/:_id")
  .get(verifyAuth, userController.getTransactionById);

export default { userRouter: router };
