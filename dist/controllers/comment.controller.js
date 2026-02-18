"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const teamleaddetail_model_1 = require("../models/teamleaddetail.model");
const ticket_model_1 = require("../models/ticket.model");
const producer_1 = require("../kafka/producer");
class CommentController {
    static async addComment(req, res) {
        try {
            const ticketId = parseInt(req.params.ticketId); // 🔁
            const { comment } = req.body;
            console.log(`Add comment request received: ticketId=${ticketId}, comment="${comment}"`);
            const ticket = await ticket_model_1.Ticket.findByPk(ticketId);
            if (!ticket) {
                console.log('Ticket not found');
                return res.status(404).json({ message: 'Ticket not found' });
            }
            // TODO: Save comment logic here...
            console.log('Fetched ticket:', ticket);
            const teamLead = await teamleaddetail_model_1.TeamLead.findOne({
                where: { reportingManagerName: ticket.reportingmanager },
            });
            if (teamLead) {
                console.log('Team lead found:', teamLead.email);
                await (0, producer_1.sendKafkaMessage)('ticket-alerts', {
                    type: 'COMMENT_ADDED',
                    to: teamLead.email,
                    subject: `New comment on ticket: ${ticket.title}`,
                    body: `Comment added by ${ticket.ownedby}: "${comment}"`,
                });
            }
            else {
                console.log('Team lead not found for reporting manager:', ticket.reportingmanager);
            }
            res.status(200).json({ message: 'Comment added and manager notified' });
        }
        catch (error) {
            console.error('Error in addComment:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.CommentController = CommentController;
