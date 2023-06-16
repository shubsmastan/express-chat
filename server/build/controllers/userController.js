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
exports.logOutOfProfile = exports.createProfile = exports.loginToProfile = exports.getProfile = exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const debug_1 = __importDefault(require("debug"));
const express_validator_1 = require("express-validator");
const User_1 = require("../models/User");
(0, debug_1.default)("express-chat:user");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
exports.usersRouter = express_1.default.Router();
const salt = bcryptjs_1.default.genSaltSync(10);
let jwtSecret;
if (process.env.JWT_SECRET) {
    jwtSecret = process.env.JWT_SECRET;
}
else {
    throw new Error("Environment variables are not set.");
}
const getProfile = (req, res) => {
    if (req.cookies.token) {
        jsonwebtoken_1.default.verify(req.cookies.token, jwtSecret, {}, (err, userData) => {
            if (err)
                (0, debug_1.default)("Token could not be verified.");
            return res.json(userData);
        });
    }
    else {
        res.status(401);
    }
};
exports.getProfile = getProfile;
const loginToProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield User_1.User.findOne({ username });
        if (user) {
            if (bcryptjs_1.default.compareSync(password, user.password)) {
                jsonwebtoken_1.default.sign({ _id: user === null || user === void 0 ? void 0 : user._id, username }, jwtSecret, {}, (err, token) => {
                    if (err)
                        (0, debug_1.default)("Token could not be created.");
                    return res
                        .cookie("token", token, { sameSite: "none", secure: true })
                        .json({ _id: user === null || user === void 0 ? void 0 : user._id });
                });
            }
            else {
                return res.json({ errors: ["Incorrect password."] });
            }
        }
        else {
            return res.json({ errors: ["No user with that username."] });
        }
    }
    catch (err) {
        (0, debug_1.default)("Problem logging in.");
        res.json({ errors: ["Something went wrong."] });
    }
});
exports.loginToProfile = loginToProfile;
exports.createProfile = [
    (0, express_validator_1.body)("username")
        .trim()
        .isLength({ min: 3, max: 30 })
        .escape()
        .withMessage("Username must be at least 3 characters."),
    (0, express_validator_1.body)("password")
        .isLength({ min: 8 })
        .escape()
        .withMessage("Password must be at least 8 characters."),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorMsgArray = errors.array().map((err) => err.msg);
            res.json({ errors: errorMsgArray });
            return;
        }
        const { username, password } = req.body;
        try {
            const encryptedPwd = bcryptjs_1.default.hashSync(password, salt);
            const userExists = yield User_1.User.findOne({ username }).exec();
            if (userExists) {
                res.json({ errors: ["Username already taken."] });
                return;
            }
            const newUser = yield User_1.User.create({ username, password: encryptedPwd });
            jsonwebtoken_1.default.sign({ _id: newUser._id, username }, jwtSecret, {}, (err, token) => {
                if (err)
                    (0, debug_1.default)("Could not create token.");
                res
                    .cookie("token", token, { sameSite: "none", secure: true })
                    .status(201)
                    .json({ _id: newUser._id });
            });
        }
        catch (err) {
            (0, debug_1.default)("Problem creating user.");
            res.json({ errors: ["Something went wrong."] });
        }
    }),
];
const logOutOfProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token");
        res.end();
    }
    catch (err) {
        (0, debug_1.default)("Problem logging out.");
        res.json({ errors: ["Something went wrong."] });
    }
});
exports.logOutOfProfile = logOutOfProfile;
