import express from "express";
import path from "path";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
export const usersRouter = express.Router();

let jwtSecret: string;
if (process.env.JWT_SECRET) {
  jwtSecret = process.env.JWT_SECRET;
} else {
  throw new Error("Environment variables are not set.");
}

usersRouter.get(
  "/",
  function (req: Request, res: Response, next: NextFunction) {
    res.send("respond with a resource");
  }
);

usersRouter.get("/profile", (req: Request, res: Response) => {
  if (req.cookies.token) {
    jwt.verify(req.cookies.token, jwtSecret, {}, (err, userData) => {
      if (err) res.json(err);
      res.json(userData);
    });
  } else {
    res.status(401);
  }
});

usersRouter.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      if (password === user.password) {
        jwt.sign({ _id: user?._id, username }, jwtSecret, {}, (err, token) => {
          if (err) console.log(err);
          res
            .cookie("token", token, { sameSite: "none", secure: true })
            .json({ _id: user?._id });
        });
      } else {
        res.status(403).json("Password not correct.");
      }
    } else {
      res.status(404).json("User not found.");
    }
  } catch (err) {
    res.status(500).json("Something went wrong.");
  }
});

// Need to add validation with express validator
usersRouter.post("/signup", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const newUser = await User.create({ username, password });
    jwt.sign({ _id: newUser._id, username }, jwtSecret, {}, (err, token) => {
      if (err) console.log(err);
      res
        .cookie("token", token, { sameSite: "none", secure: true })
        .status(201)
        .json({ _id: newUser._id });
    });
  } catch (err) {
    console.log(err);
  }
});

usersRouter.get(
  "/cool",
  function (req: Request, res: Response, next: NextFunction) {
    res.send("you're so vain, you probably think this page is about you!");
  }
);
