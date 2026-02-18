import fetch from "node-fetch";

// Type for MCP response
interface McpResponse {
  content?: { text: string }[];
}

// Function to get MCP app summary
async function getAppSummary(): Promise<string> {
  try {
    const res = await fetch("http://localhost:3333/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "tool.run",
        params: { tool: "app.summary", args: {} },
        id: 1
      }),
    });

    const text = await res.text();
    console.log("Raw MCP response:", text);

    const data = JSON.parse(text) as McpResponse;
    return data.content?.[0]?.text || "No summary available";
  } catch (err) {
    console.error("Error calling MCP:", err);
    return "No summary available";
  }
}

// Function to send prompt to Ollama
async function askOllama(prompt: string) {
  try {
 const res = await fetch("http://127.0.0.1:11434/api/completions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "llama3",
    prompt,
    max_tokens: 300
  }),
});

    const text = await res.text();
    console.log("Raw Ollama response:", text);

    try {
      const data = JSON.parse(text);
      console.log("Ollama response:", data.choices?.[0]?.text);
    } catch (parseErr) {
      console.error("Failed to parse Ollama JSON:", parseErr);
    }

  } catch (err) {
    console.error("Error calling Ollama:", err);
  }
}

// Function to combine MCP summary + user prompt
async function askOllamaWithAppSummary(userPrompt: string) {
  const appSummary = await getAppSummary();

  const prompt = `
Application Summary:
${appSummary}

User Question:
${userPrompt}
  `;

  await askOllama(prompt);
}

// Example usage
(async () => {
  await askOllamaWithAppSummary(
    "Explain the current high-priority tickets and their owners."
  );
})();
