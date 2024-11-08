import { Router } from "express";
import {
  createUser,
  getUser,
  userLogin,
} from "../../controllers/user.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

export const AuthRouter = Router();

AuthRouter.get("/getalluser", getUser);
AuthRouter.post("/registerUser", createUser);
AuthRouter.post("/login", userLogin);
AuthRouter.get("/check", authMiddleware, getUser);
