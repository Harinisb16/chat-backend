"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const mcp_tools_1 = require("./mcp-tools");
const mcp_resources_1 = require("./mcp-resources");
async function main() {
    try {
        // 1️⃣ Create MCP server instance
        const server = new mcp_js_1.McpServer({ name: "ticketing-mcp", version: "1.0.0" });
        // 2️⃣ Register tools and resources
        (0, mcp_tools_1.registerTools)(server);
        (0, mcp_resources_1.registerResources)(server);
        // 3️⃣ Start HTTP server if --http flag is passed
        if (process.argv.includes("--http")) {
            const app = (0, express_1.default)();
            app.use(express_1.default.json());
            // 4️⃣ Setup transport
            const transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
                sessionIdGenerator: () => Math.random().toString(36).substring(2, 15), // generates session IDs
            });
            // 5️⃣ All /mcp requests go through the MCP transport
            app.all("/mcp", async (req, res) => {
                try {
                    await transport.handleRequest(req, res);
                }
                catch (err) {
                    console.error("Error handling MCP request:", err);
                    res.status(500).json({ error: "Internal Server Error" });
                }
            });
            // 6️⃣ Connect MCP server to transport
            await server.connect(transport);
            // 7️⃣ Start Express server
            const PORT = 3333;
            app.listen(PORT, () => console.log(`MCP server running at http://localhost:${PORT}/mcp`));
        }
    }
    catch (err) {
        console.error("Failed to start MCP server:", err);
        process.exit(1);
    }
}
main();
