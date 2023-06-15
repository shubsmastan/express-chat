import express from "express";
import path from "path";
import dotenv from "dotenv";
import { body, validationResult } from "express-validator";
import { Request, Response } from "express";
import { Message } from "../models/Message";
import { User } from "../models/User";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
export const messagesRouter = express.Router();

let jwtSecret: string;
if (process.env.JWT_SECRET) {
  jwtSecret = process.env.JWT_SECRET;
} else {
  throw new Error("Environment variables are not set.");
}

export const getMessages = async (req: Request, res: Response) => {
  const messages = await Message.find().sort({ createdAt: 1 });
  res.json(messages);
};

export const createMessage = [
  body("message").isLength({ min: 1 }),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsgArray = errors.array().map((err) => err.msg);
      res.json({ errors: errorMsgArray });
      return;
    }
    try {
      const { message, username } = req.body;
      const foundUser = await User.findOne({ username }).exec();
      const newMsg = new Message({ message, user: foundUser?.username });
      await newMsg.save();
      res.json(newMsg);
    } catch (err) {
      console.log(err);
      res.json({ errors: ["Something went wrong."] });
    }
  },
];
