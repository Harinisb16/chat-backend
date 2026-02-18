// src/controllers/ai.controller.ts
import { Request, Response } from "express";
import { askOllama, processPrompt } from "../services/ollamaService";

export async function handleAIRequest(req: Request, res: Response) {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Route prompt to DB logic or Ollama
    const result = await processPrompt(prompt);

    res.json(result);
  } catch (err) {
    console.error("AI request error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
