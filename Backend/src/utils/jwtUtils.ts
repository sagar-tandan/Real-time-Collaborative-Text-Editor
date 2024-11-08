import jwt from "jsonwebtoken";

export const generateJWT = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const verifyJWT = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
