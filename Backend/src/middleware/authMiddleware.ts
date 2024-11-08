import { Request, Response, NextFunction, RequestHandler } from "express";
import { verifyJWT } from "../utils/jwtUtils";

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Sending response without returning
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyJWT(token);
    (req as any).userId = decoded.userId;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Sending response without returning
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};
