import { RequestHandler } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const allUser = await User.find().exec();
    res.status(200).json(allUser);
  } catch (error) {
    next(error);
  }
};

export const createUser: RequestHandler = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const passwordRaw = req.body.password;

  try {
    if (!name || !email || !passwordRaw) {
      res.status(400);
      return next("Parameters Missing!!");
    }

    const existingUserName = await User.findOne({ name: name }).exec();

    if (existingUserName) {
      res.status(409);
      return next("User with username already exists.");
    }

    const existingEmail = await User.findOne({ email: email }).exec();
    if (existingEmail) {
      res.status(409);
      return next("Email address already exists.");
    }

    const passwordHashed = bcrypt.hashSync(passwordRaw, 10);

    const newUser = await User.create({
      name: name,
      email: email,
      password: passwordHashed,
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};
