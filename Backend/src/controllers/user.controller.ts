import { RequestHandler } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { generateJWT } from "../utils/jwtUtils";

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).exec();
    res.status(200).json(user);
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

export const userLogin: RequestHandler = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email }).select("+password").exec();
    if (!user) {
      res.status(400);
      return next("Invalid Credentials!");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400);
      return next("Invalid Credentials!");
    }

    const token = generateJWT(user._id.toString());
    res.json({ token: token });
  } catch (error) {
    next(error);
  }
};
