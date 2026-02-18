"use strict";
// src/scripts/getAppSummary.ts
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_service_1 = require("../services/ticket.service");
// Type guard to validate the response
function isMcpToolResponse(obj) {
    return (obj &&
        Array.isArray(obj.content) &&
        obj.content.every((item) => typeof item.type === 'string' && typeof item.text === 'string'));
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
    const tickets = await ticket_service_1.TicketService.getAllTickets();
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
