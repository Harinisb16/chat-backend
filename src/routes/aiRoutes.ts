import express from "express";
import { processPrompt } from "../services/aiService";
import { handleAIRequest } from "../controllers/ai.controller";
const router = express.Router();

router.post("/ask", handleAIRequest);

router.post("/ask-ai", async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Question is required" });

  try {
    const result = await processPrompt(question);
    res.json(result);
  } catch (err: any) {
    console.error("AI service error:", err);
    res.status(500).json({ error: "AI service failed" });
  }
});

export default router;
