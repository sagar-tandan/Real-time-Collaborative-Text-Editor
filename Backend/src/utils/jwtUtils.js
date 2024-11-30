import jwt from "jsonwebtoken";

export const generateJWT = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const verifyJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const generateforgetPasswordToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_FP,
  });
};
