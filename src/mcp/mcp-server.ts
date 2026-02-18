import express, { Request, Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { registerTools } from "./mcp-tools";
import { registerResources } from "./mcp-resources";

async function main() {
  try {
    // 1️⃣ Create MCP server instance
    const server = new McpServer({ name: "ticketing-mcp", version: "1.0.0" });

    // 2️⃣ Register tools and resources
    registerTools(server);
    registerResources(server);

    // 3️⃣ Start HTTP server if --http flag is passed
    if (process.argv.includes("--http")) {
      const app = express();
      app.use(express.json());

      // 4️⃣ Setup transport
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () =>
          Math.random().toString(36).substring(2, 15), // generates session IDs
      });

      // 5️⃣ All /mcp requests go through the MCP transport
      app.all("/mcp", async (req: Request, res: Response) => {
        try {
          await transport.handleRequest(req, res);
        } catch (err) {
          console.error("Error handling MCP request:", err);
          res.status(500).json({ error: "Internal Server Error" });
        }
      });

      // 6️⃣ Connect MCP server to transport
      await server.connect(transport);

      // 7️⃣ Start Express server
      const PORT = 3333;
      app.listen(PORT, () =>
        console.log(`MCP server running at http://localhost:${PORT}/mcp`)
      );
    }
  } catch (err) {
    console.error("Failed to start MCP server:", err);
    process.exit(1);
  }
}

main();
