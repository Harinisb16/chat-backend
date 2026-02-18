"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// chat.routes.ts
const express_1 = require("express");
const chatController = __importStar(require("../controllers/chat.controller"));
const chat_controller_1 = require("../controllers/chat.controller");
const router = (0, express_1.Router)();
/* ================= CHAT ROUTES ================= */
// Fetch chats for the logged-in user (admin sees all users, normal user sees admin)
router.get("/", chatController.fetchChatsForUser);
// Fetch all users (for admin sidebar)
// router.get("/users", chatController.fetchUsers);
router.get("/admin", chat_controller_1.getAdmin);
// Get messages between admin and a user
router.get("/messages/:userId/:adminId", chatController.fetchMessages);
// Get messages between any two users
router.get("/:user1/:user2", chatController.fetchMessagesBetweenUsers); // optional
exports.default = router;
