import express from "express";
import path from "path";
import dotenv from "dotenv";
import debug from "debug";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { Request, Response } from "express";
import { Message } from "../models/Message";
import { User } from "../models/User";

debug("express-chat:msg");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
export const messagesRouter = express.Router();

let jwtSecret: string;
if (process.env.JWT_SECRET) {
  jwtSecret = process.env.JWT_SECRET;
} else {
  throw new Error("Environment variables are not set.");
}

export const getMessages = async (req: Request, res: Response) => {
  try {
    if (!req.cookies.token) {
      return res.status(401).json({ errors: ["You are not logged in."] });
    }
    jwt.verify(req.cookies.token, jwtSecret, {}, (err, user) => {
      if (err) {
        return res
          .status(500)
          .json({ errors: ["Token could not be verified."] });
      }
    });
    const messages = await Message.find().sort({ createdAt: 1 });
    return res.json(messages);
  } catch (err) {
    debug("Something went wrong - could not get messages.");
    return res.json({
      errors: ["Something went wrong - could not get messages."],
    });
  }
};

export const createMessage = [
  body("message").isLength({ min: 1 }),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsgArray = errors.array().map((err) => err.msg);
      return res.json({ errors: errorMsgArray });
    }
    try {
      if (!req.cookies.token) {
        return res.status(401).json({ errors: ["You are not logged in."] });
      }
      const { message, username } = req.body;
      const foundUser = await User.findOne({ username }).exec();
      const newMsg = new Message({ message, user: foundUser?.username });
      await newMsg.save();
      return res.json(newMsg);
    } catch (err) {
      debug("Something went wrong - message not sent.");
      return res.json({ errors: ["Something went wrong - message not sent."] });
    }
  },
];
