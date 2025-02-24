import express from "express";
import { authController } from "./auth.controller.js";
import { verifyAuth } from "../../utils/authHelper/verifyAuth.js";
const router = express.Router();
router.route("/sign-up").post(authController.registerUser);

router.route("/login").post(authController.loginUser);

router.route("/info").get(verifyAuth, authController.auth);

export default { authRouter: router };
