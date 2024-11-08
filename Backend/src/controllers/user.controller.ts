import { RequestHandler } from "express";
import User from "../models/user.model";

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const allUser = await User.find().exec();
    res.status(200).json(allUser);
  } catch (error) {
    next(error);
  }
};
