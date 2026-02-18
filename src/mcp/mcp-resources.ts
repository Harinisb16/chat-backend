import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Ticket } from "../models/ticket.model";
import { Team } from "../models/team.model";

export function registerResources(server: McpServer) {
  // Single ticket resource
  server.registerResource(
    "ticket",
    new ResourceTemplate("ticket://{id}", { list: undefined }),
    {
      title: "Ticket",
      description: "Fetch a ticket by ID",
      mimeType: "text/markdown",
    },
    async (uri, params) => {
      const id = Array.isArray(params.id) ? Number(params.id[0]) : Number(params.id);

      if (isNaN(id)) {
        return { contents: [{ uri: uri.href, text: "Invalid ticket ID" }] };
      }

      const ticket = await Ticket.findByPk(id);

      if (!ticket) {
        return { contents: [{ uri: uri.href, text: "Ticket not found" }] };
      }

      const md = `# Ticket #${ticket.id}\n**Title:** ${ticket.title}\n**Status:** ${ticket.status}`;
      return { contents: [{ uri: uri.href, text: md }] };
    }
  );

  // Teams list resource
  server.registerResource(
    "teams",
    new ResourceTemplate("teams://all", { list: undefined }),
    {
      title: "All Teams",
      description: "List all teams",
      mimeType: "text/markdown",
    },
    async (uri) => {
      const teams = await Team.findAll();
      const md = teams.map((t) => `- Team #${t.id}: ${t.teamName}`).join("\n");
      return { contents: [{ uri: uri.href, text: md }] };
    }
  );
}
