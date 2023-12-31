import express from "express";
import path from "path";
import dotenv from "dotenv";
import { Request, Response } from "express";
import {
  createProfile,
  getProfile,
  logOutOfProfile,
  loginToProfile,
} from "../controllers/userController";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
export const usersRouter = express.Router();

let jwtSecret: string;
if (process.env.JWT_SECRET) {
  jwtSecret = process.env.JWT_SECRET;
} else {
  throw new Error("Environment variables are not set.");
}

usersRouter.get("/profile", getProfile);

usersRouter.post("/login", loginToProfile);

usersRouter.post("/signup", createProfile);

usersRouter.delete("/logout", logOutOfProfile);

usersRouter.get("/cool", (req: Request, res: Response) => {
  res.send("you're so vain, you probably think this page is about you!");
});
