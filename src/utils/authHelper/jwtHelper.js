import jwt from "jsonwebtoken";

const createJwtToken = (payload, secret, expiry) => {
  return jwt.sign(payload, secret, { expiresIn: expiry });
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};
export const jwtHelpers = { createJwtToken, verifyToken };
