import { RequestHandler } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import {
  generateJWT,
  generateforgetPasswordToken,
  verifyJWT,
} from "../utils/jwtUtils";

//GET USER DATA BASED ON ID
export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).exec();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

//CREATE NEW ACCOUNT
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

// LOGIN WITH DATA
export const userLogin: RequestHandler = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email }).select("+password").exec();
    if (!user) {
      res.status(400).json({ message: "Invalid Credentials!!" });
      return;
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

//UPDATE USERNAME AND EMAIL
export const updateData: RequestHandler = async (req, res, next) => {
  const { newUsername, newEmail } = req.body;
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).exec();
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (newEmail != user.email) {
      const existingEmail = await User.findOne({ email: newEmail }).exec();
      if (existingEmail) {
        res.status(409).json({ message: "Email is already taken" });
        return;
      }
      user.email = newEmail;
    }

    if (newUsername != user.name) {
      const existingUser = await User.findOne({ name: newUsername }).exec();
      if (existingUser) {
        res.status(409).json({ message: "Username is already taken" });
        return;
      }
      user.name = newUsername;
    }
    await user.save();
    res.status(200).json({ message: "User information updated successfully" });
  } catch (error) {
    next(error);
  }
};

//CHANGE PASSWORD
export const changePassword: RequestHandler = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    res
      .status(400)
      .json({ message: "Old password and new password are required" });
    return;
  }
  if (oldPassword === newPassword) {
    res
      .status(400)
      .json({ message: "New password cannot be the same as the old password" });
    return;
  }

  if (newPassword.length < 6) {
    res
      .status(400)
      .json({ message: "Password length cannot be less than 6 characters" });
    return;
  }
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).select("+password").exec();
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Compare old password with stored password
    const isPassValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPassValid) {
      res.status(400).json({ message: "Incorrect old password!" });
      return;
    }

    // Hash the new password
    const updatedPassword = await bcrypt.hash(newPassword, 10);
    user.password = updatedPassword;

    // Save the updated password
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

//FORGET PASSWORD: GENERATE TOKEN

export const forgetPasswordToken: RequestHandler = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "Enter email address" });
    return;
  }

  try {
    const emailExist = await User.findOne({ email: email }).exec();
    if (!emailExist) {
      res.status(409).json("Invalid Credentials!");
      return;
    }
    const token = generateforgetPasswordToken(email.toString());
    res.json({ token: token });
  } catch (error) {
    next(error);
  }
};

//VERIFY TOKEN TO RESET PASSWORD
export const verifyTokenForReset: RequestHandler = async (req, res, next) => {
  const { token } = req.params;
  try {
    const decoded = verifyJWT(token.toString());
    (req as any).email = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};


//ACTUAL RESET PASSWORD 
export const resetPassword: RequestHandler = async (req, res, next) => {
  const password = req.body.password;
  const email = (req as any).email;
  console.log(email);
  if (password.trim().length < 6) {
    res
      .status(400)
      .json({ message: "Password length cannot be less than 6 characters" });
    return;
  }

  try {
    const user = await User.findOne({ email: email })
      .select("+password")
      .exec();
    if (!user) {
      res.status(409).json({ message: "No user found." });
      return;
    }
    const passwordHashed = await bcrypt.hash(password, 10);

    user.password = passwordHashed;

    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
};
