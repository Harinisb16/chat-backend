// import { z } from "zod";
// import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// import { TicketService } from "../services/ticket.service";
// import { User } from "../models/user.model";
// import { Team } from "../models/team.model";

// export function registerTools(server: McpServer) {
//   // --- Ticket tools ---
//   server.registerTool(
//     "ticket.create",
//     {
//       title: "Create Ticket",
//       description: "Create a new ticket",
//       inputSchema: {
//         title: z.string(),
//         description: z.string(),
//         ownedby: z.string(),
//         reportingmanager: z.string(),
//         priority: z.enum(["low", "medium", "high"]).default("medium"),
//       },
//     },
//     async (args) => {
//       const ticket = await TicketService.createTicket(args);
//       return {
//         content: [{ type: "text", text: `Created ticket #${ticket.id}` }],
//       };
//     }
//   );

//   server.registerTool(
//     "ticket.updateStatus",
//     {
//       title: "Update Ticket Status",
//       description: "Change the status of a ticket",
//       inputSchema: { id: z.number(), status: z.string() },
//     },
//     async ({ id, status }) => {
//       const ticket = await TicketService.updateTicket(id, { status });
//       return {
//         content: [{ type: "text", text: `Ticket #${id} → ${ticket.status}` }],
//       };
//     }
//   );

//   // --- User tools ---
//   server.registerTool(
//     "user.create",
//     {
//       title: "Create User",
//       description: "Create a new user",
//       inputSchema: { username: z.string(), email: z.string() },
//     },
//     async (args) => {
//       const user = await User.create(args);
//       return {
//         content: [{ type: "text", text: `User created: ${user.username}` }],
//       };
//     }
//   );

//   server.registerTool(
//     "user.assignToTeam",
//     {
//       title: "Assign User to Team",
//       description: "Assign an existing user to a team",
//       inputSchema: { userId: z.number(), teamId: z.number() },
//     },
//     async ({ userId, teamId }) => {
//       const team = await Team.findByPk(teamId);
//       const user = await User.findByPk(userId);
//       if (!user || !team) {
//         return { content: [{ type: "text", text: "User or Team not found" }] };
//       }
//       await user.$add("teams", teamId);
//       return {
//         content: [{ type: "text", text: `User ${userId} assigned to Team ${teamId}` }],
//       };
//     }
//   );

//   server.registerTool(
//   "app.summary",
//   {
//     title: "Application Summary",
//     description: "Return details about the ticketing application",
//     inputSchema: {}, // no input needed
//   },
//   async () => {
//     // Return any summary you want about your app
//     return {
//       content: [
//         {
//           type: "text",
//           text: `Ticketing App MCP Server running with tools: ticket.create, ticket.updateStatus, user.create, user.assignToTeam`
//         }
//       ],
//     };
//   }
// );

// }


import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TicketService } from "../services/ticket.service";
import { User } from "../models/user.model";
import { Team } from "../models/team.model";

export function registerTools(server: McpServer) {

  // --- Ticket tools ---
  server.registerTool(
    "ticket.create",
    {
      title: "Create Ticket",
      description: "Create a new ticket",
      inputSchema: {
        title: z.string(),
        description: z.string(),
        ownedby: z.string(),
        reportingmanager: z.string(),
        priority: z.enum(["low", "medium", "high"]).default("medium"),
      },
    },
    async (args) => {
      const ticket = await TicketService.createTicket(args);
      return {
        content: [
          { type: "text", text: `Created ticket #${ticket.id}` }
        ],
      };
    }
  );

  server.registerTool(
    "ticket.updateStatus",
    {
      title: "Update Ticket Status",
      description: "Change the status of a ticket",
      inputSchema: { id: z.number(), status: z.string() },
    },
    async ({ id, status }) => {
      const ticket = await TicketService.updateTicket(id, { status });
      return {
        content: [
          { type: "text", text: `Ticket #${id} → ${ticket.status}` }
        ],
      };
    }
  );

  // --- User tools ---
  server.registerTool(
    "user.create",
    {
      title: "Create User",
      description: "Create a new user",
      inputSchema: { username: z.string(), email: z.string() },
    },
    async (args: { username: string; email: string }) => {
      return {
        content: [
          {
            type: "text",
            text: `User ${args.username} with email ${args.email} created successfully`,
          },
        ],
      };
    }
  );

  server.registerTool(
    "user.assignToTeam",
    {
      title: "Assign User to Team",
      description: "Assign an existing user to a team",
      inputSchema: { userId: z.number(), teamId: z.number() },
    },
    async ({ userId, teamId }) => {
      const team = await Team.findByPk(teamId);
      const user = await User.findByPk(userId);

      if (!user || !team) {
        return {
          content: [{ type: "text", text: "User or Team not found" }],
        };
      }

      await user.$add("teams", teamId);

      return {
        content: [
          { type: "text", text: `User ${userId} assigned to Team ${teamId}` }
        ],
      };
    }
  );

  server.registerTool(
    "app.summary",
    {
      title: "Application Summary",
      description: "Return details about the ticketing application",
      inputSchema: {},
    },
    async () => {
      return {
        content: [
          {
            type: "text",
            text: `Ticketing App MCP Server running with tools: ticket.create, ticket.updateStatus, user.create, user.assignToTeam`,
          },
        ],
      };
    }
  );
}
