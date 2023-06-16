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
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const http_errors_1 = __importDefault(require("http-errors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const users_1 = require("./routes/users");
const messages_1 = require("./routes/messages");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
let mongoURI, hostURL, jwtSecret;
if (process.env.MONGODB_URI && process.env.HOST_URL) {
    mongoURI = process.env.MONGODB_URI;
    hostURL = process.env.HOST_URL;
}
else {
    throw new Error("Environment variables are not set.");
}
mongoose_1.default.set("strictQuery", false);
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(mongoURI);
        }
        catch (err) {
            throw err;
        }
    });
})();
const PORT = process.env.PORT || 3030;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: hostURL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    socket.on("send_message", (data) => {
        console.log("send message event", socket);
        io.sockets.emit("receive_message", data);
    });
});
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use((0, cors_1.default)({
    credentials: true,
    origin: hostURL || "http://localhost:5173",
}));
app.use((0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 20,
}));
app.use("/users", users_1.usersRouter);
app.use("/messages", messages_1.messagesRouter);
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.send(err.status + " error");
});
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
