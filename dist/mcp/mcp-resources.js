"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerResources = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const ticket_model_1 = require("../models/ticket.model");
const team_model_1 = require("../models/team.model");
function registerResources(server) {
    // Single ticket resource
    server.registerResource("ticket", new mcp_js_1.ResourceTemplate("ticket://{id}", { list: undefined }), {
        title: "Ticket",
        description: "Fetch a ticket by ID",
        mimeType: "text/markdown",
    }, async (uri, params) => {
        const id = Array.isArray(params.id) ? Number(params.id[0]) : Number(params.id);
        if (isNaN(id)) {
            return { contents: [{ uri: uri.href, text: "Invalid ticket ID" }] };
        }
        const ticket = await ticket_model_1.Ticket.findByPk(id);
        if (!ticket) {
            return { contents: [{ uri: uri.href, text: "Ticket not found" }] };
        }
        const md = `# Ticket #${ticket.id}\n**Title:** ${ticket.title}\n**Status:** ${ticket.status}`;
        return { contents: [{ uri: uri.href, text: md }] };
    });
    // Teams list resource
    server.registerResource("teams", new mcp_js_1.ResourceTemplate("teams://all", { list: undefined }), {
        title: "All Teams",
        description: "List all teams",
        mimeType: "text/markdown",
    }, async (uri) => {
        const teams = await team_model_1.Team.findAll();
        const md = teams.map((t) => `- Team #${t.id}: ${t.teamName}`).join("\n");
        return { contents: [{ uri: uri.href, text: md }] };
    });
}
exports.registerResources = registerResources;
