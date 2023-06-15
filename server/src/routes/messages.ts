import express from "express";
import path from "path";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { createMessage, getMessages } from "../controllers/messageController";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
export const messagesRouter = express.Router();

let jwtSecret: string;
if (process.env.JWT_SECRET) {
  jwtSecret = process.env.JWT_SECRET;
} else {
  throw new Error("Environment variables are not set.");
}

messagesRouter.get("/", getMessages);

messagesRouter.post("/", createMessage);

messagesRouter.get("/cool", (req: Request, res: Response) => {
  res.send("you think you're cooler than me?");
});
