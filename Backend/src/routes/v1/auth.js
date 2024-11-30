import { Router } from "express";
import {
  changePassword,
  createUser,
  forgetPasswordToken,
  getUser,
  resetPassword,
  updateData,
  userLogin,
  verifyTokenForReset,
} from "../../controllers/user.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

export const AuthRouter = Router();

AuthRouter.post("/registerUser", createUser);
AuthRouter.post("/login", userLogin);
AuthRouter.get("/getUser", authMiddleware, getUser);
AuthRouter.put("/updateDate", authMiddleware, updateData);
AuthRouter.put("/changePassword", authMiddleware, changePassword);
AuthRouter.post("/forgetPassword", forgetPasswordToken);
AuthRouter.put("/forgetPassword/:token", verifyTokenForReset, resetPassword);
