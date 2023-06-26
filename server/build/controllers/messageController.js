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
exports.createMessage = exports.getMessages = exports.messagesRouter = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const debug_1 = __importDefault(require("debug"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const Message_1 = require("../models/Message");
const User_1 = require("../models/User");
(0, debug_1.default)("express-chat:msg");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
exports.messagesRouter = express_1.default.Router();
let jwtSecret;
if (process.env.JWT_SECRET) {
    jwtSecret = process.env.JWT_SECRET;
}
else {
    throw new Error("Environment variables are not set.");
}
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.cookies.token) {
            return res.status(401).json({ errors: ["You are not logged in."] });
        }
        jsonwebtoken_1.default.verify(req.cookies.token, jwtSecret, {}, (err, user) => {
            if (err) {
                return res
                    .status(500)
                    .json({ errors: ["Token could not be verified."] });
            }
        });
        const messages = yield Message_1.Message.find().sort({ createdAt: 1 });
        return res.json(messages);
    }
    catch (err) {
        (0, debug_1.default)("Something went wrong - could not get messages.");
        return res.json({
            errors: ["Something went wrong - could not get messages."],
        });
    }
});
exports.getMessages = getMessages;
exports.createMessage = [
    (0, express_validator_1.body)("message").isLength({ min: 1 }),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorMsgArray = errors.array().map((err) => err.msg);
            return res.json({ errors: errorMsgArray });
        }
        try {
            if (!req.cookies.token) {
                return res.status(401).json({ errors: ["You are not logged in."] });
            }
            const { message, username } = req.body;
            const foundUser = yield User_1.User.findOne({ username }).exec();
            const newMsg = new Message_1.Message({ message, user: foundUser === null || foundUser === void 0 ? void 0 : foundUser.username });
            yield newMsg.save();
            return res.json(newMsg);
        }
        catch (err) {
            (0, debug_1.default)("Something went wrong - message not sent.");
            return res.json({ errors: ["Something went wrong - message not sent."] });
        }
    }),
];
