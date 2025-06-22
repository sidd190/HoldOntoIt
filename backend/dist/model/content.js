"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ContentTypes = ['audio', 'video', 'article', 'link'];
const ContentSchema = new mongoose_1.default.Schema({
    link: { type: String, required: true },
    type: { type: String, enum: ContentTypes, required: true },
    title: { type: String, required: true },
    tag: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true }
});
exports.Content = mongoose_1.default.model('Content', ContentSchema);
