import express, { Express, Request, Response } from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
import { User, UserDoc } from "./models/User";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

let mongoURI: string;
if (process.env.MONGODB_URI) {
  mongoURI = process.env.MONGODB_URI;
} else {
  throw new Error("DB URI environment variable is not set.");
}

mongoose.set("strictQuery", false);
(async function () {
  try {
    await mongoose.connect(mongoURI);
  } catch (error) {
    throw error;
  }
})();

const PORT: string | number = process.env.PORT || 3030;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.get("/profile", (req: Request, res: Response) => {
  if (req.cookies.token) {
    jwt.verify(
      req.cookies.token,
      "snSNUVJ9yH3F",
      {},
      (err: Error, userData: { username: string; _id: string }) => {
        if (err) throw err;
        res.json(userData);
      }
    );
  } else {
    res.status(401);
  }
});

app.post("/signup", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const newUser = await User.create({ username, password });
    jwt.sign(
      { _id: newUser._id, username },
      "snSNUVJ9yH3F",
      {},
      (err: Error, token: string) => {
        if (err) console.log(err);
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({ _id: newUser._id });
      }
    );
  } catch (err) {
    if (err) throw err;
  }
});

app.post("/login/", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    if (password === user.password) {
      jwt.sign(
        { _id: user._id, username },
        "snSNUVJ9yH3F",
        {},
        (err: Error, token: string) => {
          if (err) console.log(err);
          res
            .cookie("token", token, { sameSite: "none", secure: true })
            .json({ _id: user._id });
        }
      );
    } else {
    }
  } else {
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
