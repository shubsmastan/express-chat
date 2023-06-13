import express from "express";
import path from "path";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
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
        res.json({ errors: ["Incorrect password."] });
        return;
      }
    } else {
      res.json({ errors: ["No user with that username."] });
      return;
    }
  } catch (err) {
    console.log(err);
    res.json({ errors: ["Something went wrong."] });
  }
});

usersRouter.post("/signup", [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .escape()
    .withMessage("Username must be at least 3 characters."),
  body("password")
    .isLength({ min: 8, max: 30 })
    .escape()
    .withMessage("Password must be at least 8 characters."),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsgArray = errors.array().map((err) => err.msg);
      res.json({ errors: errorMsgArray });
      return;
    }
    try {
      const { username, password } = req.body;
      const userExists = await User.findOne({ username }).exec();
      if (userExists) {
        res.json({ errors: ["Username already taken."] });
        return;
      }
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
      res.json({ errors: ["Something went wrong."] });
    }
  },
]);

usersRouter.get(
  "/cool",
  function (req: Request, res: Response, next: NextFunction) {
    res.send("you're so vain, you probably think this page is about you!");
  }
);
