"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRouter = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const messageController_1 = require("../controllers/messageController");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
exports.messagesRouter = express_1.default.Router();
let jwtSecret;
if (process.env.JWT_SECRET) {
    jwtSecret = process.env.JWT_SECRET;
}
else {
    throw new Error("Environment variables are not set.");
}
exports.messagesRouter.get("/", messageController_1.getMessages);
exports.messagesRouter.post("/", messageController_1.createMessage);
exports.messagesRouter.get("/cool", (req, res) => {
    res.send("you think you're cooler than me?");
});
