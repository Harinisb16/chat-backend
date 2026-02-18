"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAIRequest = void 0;
const ollamaService_1 = require("../services/ollamaService");
async function handleAIRequest(req, res) {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        // Route prompt to DB logic or Ollama
        const result = await (0, ollamaService_1.processPrompt)(prompt);
        res.json(result);
    }
    catch (err) {
        console.error("AI request error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.handleAIRequest = handleAIRequest;
