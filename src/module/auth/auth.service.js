import { StatusCodes } from "http-status-codes";
import User from "./auth.model.js";
import { jwtHelpers } from "../../utils/authHelper/jwtHelper.js";
import config from "../../utils/config/index.js";
import ApiError from "../../utils/errorHandler/apiErrorHandler.js";

const user = new User();

const signUpUser = async (payload) => {
  const isUserExist = await User.findOne(
    {
      $or: [{ email: payload.email }, { phone: payload.phone }],
    },
    {
      _id: 1,
      email: 1,
      phone: 1,
      password: 1,
      isApproved: 1,
      role: 1,
      name: 1,
    }
  );

  if (isUserExist) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "User already exist with this email or phone number"
    );
  }
  const result = await User.create(payload);
  if (result) {
    const { _id, role } = result;
    const jwtPayload = { _id, role };
    const accessToken = jwtHelpers.createJwtToken(
      jwtPayload,
      config.jwt_access_secret,
      config.jwt_access_expires_in
    );
    return accessToken;
  } else {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};
const loginUser = async (payload) => {
  const isUserExist = await user.isUserExist(payload.phone);
  if (!isUserExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User dose not exist");
  }
  const isPasswordMatched = await user.isPasswordMatched(
    payload.password,
    isUserExist.password
  );
  if (!isPasswordMatched) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }
  const { _id, role } = isUserExist;
  const jwtPayload = { _id, role };
  const accessToken = jwtHelpers.createJwtToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );
  return accessToken;
};

const getAuthInfo = async (_id) => {
  const authInfo = await User.findById({ _id }).select("-password");
  if (authInfo) {
    const { name, email, _id, role, phone } = authInfo;
    return { authInfo: { name, email, _id, role, phone } };
  } else {
    throw new ApiError(StatusCodes.NOT_FOUND, "User info not found");
  }
};

export const authService = {
  signUpUser,
  loginUser,
  getAuthInfo,
};
