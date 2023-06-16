import express from "express";
import path from "path";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import debug from "debug";
import { body, validationResult } from "express-validator";
import { Request, Response } from "express";
import { User } from "../models/User";

debug("express-chat:user");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
export const usersRouter = express.Router();
const salt = bcrypt.genSaltSync(10);

let jwtSecret: string;
if (process.env.JWT_SECRET) {
  jwtSecret = process.env.JWT_SECRET;
} else {
  throw new Error("Environment variables are not set.");
}

export const getProfile = (req: Request, res: Response) => {
  if (req.cookies.token) {
    jwt.verify(req.cookies.token, jwtSecret, {}, (err, userData) => {
      if (err) debug("Token could not be verified.");
      return res.json(userData);
    });
  } else {
    res.status(401);
  }
};

export const loginToProfile = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        jwt.sign({ _id: user?._id, username }, jwtSecret, {}, (err, token) => {
          if (err) debug("Token could not be created.");
          return res
            .cookie("token", token, { sameSite: "none", secure: true })
            .json({ _id: user?._id });
        });
      } else {
        return res.json({ errors: ["Incorrect password."] });
      }
    } else {
      return res.json({ errors: ["No user with that username."] });
    }
  } catch (err) {
    debug("Problem logging in.");
    res.json({ errors: ["Something went wrong."] });
  }
};

export const createProfile = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .escape()
    .withMessage("Username must be at least 3 characters."),
  body("password")
    .isLength({ min: 8 })
    .escape()
    .withMessage("Password must be at least 8 characters."),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsgArray = errors.array().map((err) => err.msg);
      res.json({ errors: errorMsgArray });
      return;
    }
    const { username, password } = req.body;
    try {
      const encryptedPwd = bcrypt.hashSync(password, salt);
      const userExists = await User.findOne({ username }).exec();
      if (userExists) {
        res.json({ errors: ["Username already taken."] });
        return;
      }
      const newUser = await User.create({ username, password: encryptedPwd });
      jwt.sign({ _id: newUser._id, username }, jwtSecret, {}, (err, token) => {
        if (err) debug("Could not create token.");
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({ _id: newUser._id });
      });
    } catch (err) {
      debug("Problem creating user.");
      res.json({ errors: ["Something went wrong."] });
    }
  },
];

export const logOutOfProfile = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.end();
  } catch (err) {
    debug("Problem logging out.");
    res.json({ errors: ["Something went wrong."] });
  }
};
