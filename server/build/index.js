"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const http_errors_1 = __importDefault(require("http-errors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const debug_1 = __importDefault(require("debug"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const users_1 = require("./routes/users");
const messages_1 = require("./routes/messages");
(0, debug_1.default)("express-chat:app");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
let mongoCred, hostURL;
if (process.env.MONGO_CREDENTIALS && process.env.HOST_URL) {
    mongoCred = process.env.MONGO_CREDENTIALS;
    hostURL = process.env.HOST_URL;
}
else {
    throw new Error("Environment variables are not set.");
}
mongoose_1.default.set("strictQuery", false);
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(`mongodb+srv://${process.env.MONGO_CREDENTIALS}@cluster0.o0yyfgk.mongodb.net/?retryWrites=true&w=majority`);
        }
        catch (err) {
            throw err;
        }
    });
})();
const PORT = process.env.PORT || 3030;
exports.app = (0, express_1.default)();
exports.app.set("port", PORT);
const server = http_1.default.createServer(exports.app);
const io = require("socket.io")(server, {
    cors: {
        origin: hostURL,
        methods: ["GET", "POST"],
        credentials: true,
    },
});
const corsConfig = (0, cors_1.default)({
    credentials: true,
    origin: hostURL,
});
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 50,
});
io.on("connection", (socket) => {
    (0, debug_1.default)(`User connected. ${socket.id}`);
    socket.on("send_message", (data) => {
        (0, debug_1.default)(`Message sent. ${data.toString()}`);
        io.sockets.emit("receive_message", data);
    });
});
exports.app.use((0, morgan_1.default)("dev"));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: false }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, helmet_1.default)());
exports.app.use(corsConfig);
exports.app.use(limiter);
exports.app.use((0, compression_1.default)());
exports.app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
exports.app.use("/users", users_1.usersRouter);
exports.app.use("/messages", messages_1.messagesRouter);
exports.app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
exports.app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.send(err.status + " error");
});
server.listen(PORT);
server.on("error", (error) => {
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
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + (addr === null || addr === void 0 ? void 0 : addr.port);
    console.log("Listening on " + bind);
});
