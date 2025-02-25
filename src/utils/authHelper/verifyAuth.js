import { jwtHelpers } from "./jwtHelper.js";
import config from "../config/index.js";
import User from "../../module/auth/auth.model.js";

const verifyAuth = async (req, res, next) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwtHelpers.verifyToken(
      accessToken,
      config.jwt_access_secret
    );
    req.user = decoded;
    const isUserExist = await User.findById({ _id: req.user._id });
    if (!isUserExist) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    next(error);
  }
  next();
};

const verifyAuthWithRole = (allowedRoles) => {
  return async (req, res, next) => {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const decoded = jwtHelpers.verifyToken(
        accessToken,
        config.jwt_access_secret
      );
      req.user = decoded;
      const isUserExist = await User.findById({ _id: req.user._id });
      if (!isUserExist || !allowedRoles.includes(req.user.role)) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
const verifyUser = verifyAuthWithRole(["user", "admin"]);
const verifyAgent = verifyAuthWithRole(["agent", "admin"]);
const verifyAdmin = verifyAuthWithRole(["admin"]);
export { verifyAuth, verifyUser, verifyAgent, verifyAdmin };
