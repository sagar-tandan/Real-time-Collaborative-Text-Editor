import { Router } from "express";
import { createUser, getUser } from "../../controllers/user.controller";

export const AuthRouter = Router();

// AuthRouter.get("/signup", (req, res) => {
//   res.json({
//     message: "Signup",
//   });
// });

// AuthRouter.get("/signin", (req, res) => {
//   res.json({
//     message: "Signin",
//   });
// });

AuthRouter.get("/getalluser", getUser);
AuthRouter.post("/registerUser", createUser);
