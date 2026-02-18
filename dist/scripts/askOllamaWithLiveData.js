"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
// -------------------------
// Get team count from backend
// -------------------------
async function getTeamsCount() {
    try {
        const res = await (0, node_fetch_1.default)("http://localhost:3333/api/teams");
        console.log("HTTP status:", res.status);
        // Read response as text for debugging
        const text = await res.text();
        console.log("Response body:", text);
        // If request failed, throw
        if (!res.ok)
            throw new Error(`Failed to fetch teams: ${res.status}`);
        const data = JSON.parse(text);
        return Array.isArray(data) ? data.length : 0;
    }
    catch (err) {
        console.error("Error fetching teams:", err);
        return 0; // return 0 if failed
    }
}
// -------------------------
// Call Ollama API
// -------------------------
async function askOllama(prompt) {
    try {
        console.log("Sending prompt to Ollama...");
        const res = await (0, node_fetch_1.default)("http://127.0.0.1:11434/v1/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3",
                prompt,
                max_tokens: 300,
            }),
        });
        const text = await res.text();
        console.log("Raw Ollama response:", text);
        try {
            const data = JSON.parse(text);
            console.log("Ollama response:", data.choices?.[0]?.text || "No response");
        }
        catch {
            console.log("Could not parse JSON, raw response above.");
        }
    }
    catch (err) {
        console.error("Error calling Ollama:", err);
    }
}
// -------------------------
// Handle user prompt
// -------------------------
async function handlePrompt(userPrompt) {
    let contextData = "";
    if (/team/i.test(userPrompt)) {
        const count = await getTeamsCount();
        contextData = `Currently, there are ${count} teams in the system.`;
    }
    const prompt = `
You are an expert assistant. Based on the following system data:

${contextData}

Answer the user question:

${userPrompt}
  `;
    await askOllama(prompt);
}
// -------------------------
// Example usage
// -------------------------
(async () => {
    try {
        await handlePrompt("How many teams are there?");
    }
    catch (err) {
        console.error("Error in handlePrompt:", err);
    }
})();
