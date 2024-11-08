import { Request, Response, NextFunction } from "express";

// General error-handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: err.message || "An unexpected error occurred" });
};
