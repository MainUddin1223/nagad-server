import express from "express";
import { verifyAuth } from "../../utils/authHelper/verifyAuth.js";
import { userController } from "./user.controller.js";
const router = express.Router();

router.route("/transactions").get(verifyAuth, userController.getTransactions);

export default { userRouter: router };
