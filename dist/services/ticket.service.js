"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
const ticket_model_1 = require("../models/ticket.model");
const childticket_model_1 = require("../models/childticket.model");
const team_model_1 = require("../models/team.model");
const user_model_1 = __importDefault(require("../models/user.model"));
const sprint_model_1 = require("../models/sprint.model");
class TicketService {
    // Create a new ticket
    static async createTicket(data) {
        return ticket_model_1.Ticket.create(data);
    }
    static async getTicketsGroupedBySprint() {
        // Fetch all tickets
        const tickets = await ticket_model_1.Ticket.findAll();
        // Fetch all sprints
        const sprints = await sprint_model_1.Sprint.findAll();
        const result = [];
        for (const sprint of sprints) {
            // Tickets belonging to this sprint
            const sprintTickets = tickets.filter(t => t.sprint === sprint.id.toString() || t.sprint === sprint.sprintname);
            if (sprintTickets.length === 0)
                continue;
            // Find team of this sprint
            const team = await team_model_1.Team.findOne({
                where: { teamName: sprint.team },
                include: [user_model_1.default],
            });
            const teamInfo = team
                ? {
                    teamName: team.teamName,
                    users: team.users.map(u => ({ id: u.id, username: u.username || u.username })),
                }
                : null;
            result.push({
                sprint: sprint.id,
                sprintName: sprint.sprintname,
                tickets: sprintTickets,
                team: teamInfo,
            });
        }
        return result;
    }
    // Get all tickets with optional filter (e.g. ownedby)
    static async getAllTickets(filter = {}) {
        return ticket_model_1.Ticket.findAll({ where: filter });
    }
    static async getParentwithchildticket(filter = {}) {
        return ticket_model_1.Ticket.findAll({
            where: filter,
            include: [
                {
                    model: childticket_model_1.ChildTicket,
                    as: "childTickets", // ✅ must match @HasMany alias
                },
            ],
        });
    }
    // Get ticket by primary key (id)
    static async getTicketById(id) {
        return ticket_model_1.Ticket.findByPk(id);
    }
    // Update ticket by id
    static async updateTicket(id, data) {
        const ticket = await ticket_model_1.Ticket.findByPk(id);
        if (!ticket)
            throw new Error('Ticket not found');
        return ticket.update(data);
    }
    // Delete ticket by id
    static async deleteTicket(id) {
        const ticket = await ticket_model_1.Ticket.findByPk(id);
        if (!ticket)
            throw new Error('Ticket not found');
        await ticket.destroy();
        return { message: 'Ticket deleted successfully' };
    }
    // Get all parent tickets with their children (optionally filtered by ownedby)
    static async getAllParentTicketsWithChildren(filter = {}) {
        return ticket_model_1.Ticket.findAll({
            where: filter,
            include: [{ model: childticket_model_1.ChildTicket, as: 'childTickets' }],
        });
    }
    // Get child tickets by parent ticket ID
    static async getChildTicketsByParentId(parentId) {
        const parent = await ticket_model_1.Ticket.findByPk(parentId, {
            include: [{ model: childticket_model_1.ChildTicket, as: 'childTickets' }],
        });
        if (!parent)
            throw new Error('Parent ticket not found');
        // childTickets is the relation alias, return the children
        return parent.childTickets;
    }
    static async deleteAttachment(ticketId, fileName) {
        const ticket = await ticket_model_1.Ticket.findByPk(ticketId);
        if (!ticket)
            throw new Error("Ticket not found");
        // Ensure attachments is an array
        let attachments = ticket.attachments || [];
        // Remove the given file
        attachments = attachments.filter((f) => f !== fileName);
        // Update the ticket
        ticket.attachments = attachments;
        await ticket.save();
        return { message: `Attachment '${fileName}' deleted successfully` };
    }
}
exports.TicketService = TicketService;
