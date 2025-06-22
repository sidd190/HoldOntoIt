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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("./model/user");
const content_1 = require("./model/content");
const middleware_1 = require("./middleware");
const link_1 = require("./model/link");
const utils_1 = require("./utils");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const JWT_SECRET = "JigglyJiggly";
app.post('/api/v1/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    try {
        yield user_1.User.create({
            username,
            password,
            email
        });
        res.json({ messsage: "User signed up." });
    }
    catch (error) {
        res.status(401).json({ message: "User already exists." });
    }
}));
app.post('/api/v1/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = yield user_1.User.findOne({
        username,
        password
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id,
        }, JWT_SECRET);
        res.json({
            token
        });
    }
    else {
        res.status(403).json({ message: "Incorrect Credentials" });
    }
}));
app.post('/api/v1/content', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title, tag } = req.body;
    try {
        yield content_1.Content.create({
            link,
            type,
            title,
            //@ts-ignore
            userId: req.userId,
            tag: [],
        });
        res.json({ message: "Added" });
    }
    catch (error) {
        res.status(403).json({ message: "Error" + error });
    }
}));
app.get('/api/v1/content', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    try {
        const content = yield content_1.Content.find({ userId: userId }).populate("userId", "username");
        res.json({ content });
    }
    catch (error) {
        res.status(404).json({ message: "Content not found!" });
        console.log("Error in getContent controller : " + error);
    }
}));
app.delete('/api/v1/content', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    yield content_1.Content.deleteMany({
        contentId,
        //@ts-ignore
        userId: req.userId
    });
}));
app.post('/api/v1/brain/share', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    const hash = (0, utils_1.random)(10);
    if (share) {
        const exisitingLink = yield link_1.Link.findOne({
            //@ts-ignore
            userId: req.userId
        });
        if (exisitingLink) {
            res.json({
                message: "already exisits : /share/" + exisitingLink.hash
            });
        }
        yield link_1.Link.create({
            //@ts-ignore
            userId: req.userId,
            hash
        });
        res.json({
            message: "/share/" + hash
        });
    }
    else {
        yield link_1.Link.deleteOne({
            //@ts-ignore
            userId: req.userId
        });
        res.json({
            message: "Removed Link"
        });
    }
}));
app.get('/api/v1/brain/:shareLink', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield link_1.Link.findOne({
        hash: hash
    });
    if (!link) {
        res.status(411).json({ message: "Invalid sharelink" });
        return;
    }
    const content = yield content_1.Content.find({
        userId: link.userId
    });
    const user = yield user_1.User.find({
        _id: link.userId
    });
    if (!user) {
        res.status(404).json({ message: "INVALID ERROR IN ShARELink" });
        return;
    }
    res.json({
        //@ts-ignore
        username: user.username,
        content: content
    });
}));
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
