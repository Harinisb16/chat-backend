import { Request, Response } from 'express';
import { TeamLead } from '../models/teamleaddetail.model';
import { Ticket } from '../models/ticket.model';
import { sendKafkaMessage } from '../kafka/producer';

export class CommentController {
static async addComment(req: Request, res: Response) {
  try {
    const ticketId = parseInt(req.params.ticketId); // 🔁
    const { comment } = req.body;

    console.log(`Add comment request received: ticketId=${ticketId}, comment="${comment}"`);
    const ticket = await Ticket.findByPk(ticketId);

    if (!ticket) {
      console.log('Ticket not found');
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // TODO: Save comment logic here...
    console.log('Fetched ticket:', ticket);

    const teamLead = await TeamLead.findOne({
      where: { reportingManagerName: ticket.reportingmanager },
    });

    if (teamLead) {
      console.log('Team lead found:', teamLead.email);
      await sendKafkaMessage('ticket-alerts', {
        type: 'COMMENT_ADDED',
        to: teamLead.email,
        subject: `New comment on ticket: ${ticket.title}`,
        body: `Comment added by ${ticket.ownedby}: "${comment}"`,
      });
    } else {
      console.log('Team lead not found for reporting manager:', ticket.reportingmanager);
    }

    res.status(200).json({ message: 'Comment added and manager notified' });
  } catch (error) {
    console.error('Error in addComment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
}