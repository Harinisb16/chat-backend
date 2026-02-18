// src/scripts/getAppSummary.ts

import { TicketService } from "../services/ticket.service";

interface McpToolResponse {
  content: { type: string; text: string }[];
}

// Type guard to validate the response
function isMcpToolResponse(obj: any): obj is McpToolResponse {
  return (
    obj &&
    Array.isArray(obj.content) &&
    obj.content.every(
      (item: any) => typeof item.type === 'string' && typeof item.text === 'string'
    )
  );
}

async function getAppSummary() {
  const res = await fetch('http://localhost:3333/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool: 'app.summary', args: {} })
  });

  const data = await res.json();
//   console.log(data.content[0].text);
}
async function getTicketSummary() {
  const tickets = await TicketService.getAllTickets();
  // Only send relevant info to AI
  return tickets.map(t => ({
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    assignedTo: t.ownedby,
    reportingManager: t.reportingmanager,
  }));
}
getAppSummary();

