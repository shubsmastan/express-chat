import express, { NextFunction, Request, Response } from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "morgan";
import createError from "http-errors";
import cors from "cors";
import cookieParser from "cookie-parser";
import RateLimit from "express-rate-limit";
import { usersRouter } from "./routes/users";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

let mongoURI: string, hostURL: string, jwtSecret: string;
if (process.env.MONGODB_URI && process.env.HOST_URL) {
  mongoURI = process.env.MONGODB_URI;
  hostURL = process.env.HOST_URL;
} else {
  throw new Error("Environment variables are not set.");
}

mongoose.set("strictQuery", false);
(async function () {
  try {
    await mongoose.connect(mongoURI);
  } catch (err) {
    throw err;
  }
})();

const PORT: string | number = process.env.PORT || 3030;

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    credentials: true,
    origin: hostURL || "http://localhost:5173",
  })
);
app.use(
  RateLimit({
    windowMs: 60 * 1000,
    max: 20,
  })
);

app.use("/users", usersRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.send(err.status + " error");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
