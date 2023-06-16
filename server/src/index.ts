import express, { NextFunction, Request, Response } from "express";
import http from "http";
import path, { normalize } from "path";
import logger from "morgan";
import cors from "cors";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import debug from "debug";
import compression from "compression";
import helmet from "helmet";
import RateLimit from "express-rate-limit";
import { usersRouter } from "./routes/users";
import { messagesRouter } from "./routes/messages";
import { Socket } from "socket.io";

debug("express-chat:app");

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

export const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: hostURL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const corsConfig = cors({
  credentials: true,
  origin: hostURL,
});

const limiter = RateLimit({
  windowMs: 60 * 1000,
  max: 50,
});

io.on("connection", (socket: Socket) => {
  debug(`User connected. ${socket.id}`);
  socket.on("send_message", (data) => {
    debug(`Message sent. ${data.toString()}`);
    io.sockets.emit("receive_message", data);
  });
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(corsConfig);
app.use(limiter);
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));
app.use("/users", usersRouter);
app.use("/messages", messagesRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.send(err.status + " error");
});

server.listen(PORT);

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on("listening", () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  console.log("Listening on " + bind);
});
