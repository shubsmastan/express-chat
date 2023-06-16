"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const userController_1 = require("../controllers/userController");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
exports.usersRouter = express_1.default.Router();
let jwtSecret;
if (process.env.JWT_SECRET) {
    jwtSecret = process.env.JWT_SECRET;
}
else {
    throw new Error("Environment variables are not set.");
}
exports.usersRouter.get("/", (req, res) => {
    res.send("respond with a resource");
});
exports.usersRouter.get("/profile", userController_1.getProfile);
exports.usersRouter.post("/login", userController_1.loginToProfile);
exports.usersRouter.post("/signup", userController_1.createProfile);
exports.usersRouter.delete("/logout", userController_1.logOutOfProfile);
exports.usersRouter.get("/cool", (req, res) => {
    res.send("you're so vain, you probably think this page is about you!");
});
