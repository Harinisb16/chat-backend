"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiService_1 = require("../services/aiService");
const ai_controller_1 = require("../controllers/ai.controller");
const router = express_1.default.Router();
router.post("/ask", ai_controller_1.handleAIRequest);
router.post("/ask-ai", async (req, res) => {
    const { question } = req.body;
    if (!question)
        return res.status(400).json({ error: "Question is required" });
    try {
        const result = await (0, aiService_1.processPrompt)(question);
        res.json(result);
    }
    catch (err) {
        console.error("AI service error:", err);
        res.status(500).json({ error: "AI service failed" });
    }
});
exports.default = router;
