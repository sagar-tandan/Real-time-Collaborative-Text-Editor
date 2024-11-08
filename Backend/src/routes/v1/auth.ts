import { Router } from "express";

export const AuthRouter = Router();

AuthRouter.get("/signup", (req, res) => {
  res.json({
    message: "Signup",
  });
});

AuthRouter.get("/signin", (req, res) => {
  res.json({
    message: "Signin",
  });
});


