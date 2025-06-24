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
const mongoose_1 = __importDefault(require("mongoose"));
const { User } = require('dimsee');
const content_1 = require("./model/content");
const { authMiddleware } = require('dimsee/backend');
const link_1 = require("./model/link");
const utils_1 = require("./utils");
const { createAuthBackend } = require('dimsee/backend');
if (!mongoose_1.default.models.User) {
    mongoose_1.default.models.User = User;
}
const app = createAuthBackend({
    mongoUri: "mongodb://localhost:27017/SecondBrain",
    jwtSecret: "JigglyJiggly",
    jwtExpiry: '15m'
});
app.use(express_1.default.json());
app.post('/api/v1/content', authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { link, type, title, tag } = req.body;
    try {
        yield content_1.Content.create({
            link,
            type,
            title,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
            tag: tag || [],
        });
        res.json({ message: "Added" });
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: "Error occurred" + error });
    }
}));
app.get('/api/v1/content', authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    try {
        const content = yield content_1.Content.find({ userId });
        res.json({ content });
    }
    catch (error) {
        //@ts-ignore
        res.status(404).json({ message: "Content not found!", error: error.message });
    }
}));
app.delete('/api/v1/content', authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    yield content_1.Content.deleteMany({
        contentId,
        //@ts-ignore
        userId: req.userId
    });
}));
app.post('/api/v1/brain/share', authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    const hash = (0, utils_1.random)(10);
    if (share) {
        const exisitingLink = yield link_1.Link.findOne({
            //@ts-ignore
            userId: req.user.userId,
        });
        if (exisitingLink) {
            res.json({
                message: "already exisits : /share/" + exisitingLink.hash
            });
        }
        yield link_1.Link.create({
            //@ts-ignore
            userId: req.user.userId,
            hash
        });
        res.json({
            message: "/share/" + hash
        });
    }
    else {
        yield link_1.Link.deleteOne({
            //@ts-ignore
            userId: req.user.userId
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
    const user = yield User.find({
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
