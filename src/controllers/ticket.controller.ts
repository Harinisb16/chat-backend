// src/controllers/ticket.controller.ts
import { Request, Response } from 'express';
import { TicketService } from '../services/ticket.service';
import { Ticket } from '../models/ticket.model';
import { ChildTicket } from '../models/childticket.model';
import { sendKafkaMessage } from '../kafka/producer';
import { TeamLead } from '../models/teamleaddetail.model';
import User from '../models/user.model';
import { confirmTicketOwner, notifyReportingManager } from '../services/notificationService';

export class TicketController {

static async getMyTickets(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tickets = await Ticket.findAll({
      where: { ownedby: req.user.username },
      include: ['childTickets'],
    });

    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

static async getChildTicketsByParentId(req: Request, res: Response): Promise<void> {
    try {
      const parentId = +req.params.parentId;
      const children = await TicketService.getChildTicketsByParentId(parentId);
      res.status(200).json(children);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

 static async create(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file?.filename;

      // 1. Create the ticket
      const newTicket = await TicketService.createTicket({
        ...req.body,
        attachment: file || null,
      });

      // 2. Get ticket owner
      const ownerUser = await User.findOne({
        where: { username: newTicket.ownedby },
      });

      // 3. Get reporting manager
      const reportingManagerUser = await User.findOne({
        where: { username: newTicket.reportingmanager },
      });

      // 4. Notify reporting manager
      if (reportingManagerUser) {
        console.log('Reporting manager found:', reportingManagerUser.email);
        await notifyReportingManager(
          reportingManagerUser.email,
          newTicket.ownedby,
          newTicket.reportingmanager,
          newTicket.title,
          newTicket.comments
        );
      } else {
        console.log('Reporting manager not found:', newTicket.reportingmanager);
      }

      // 5. Confirm to ticket owner
      if (ownerUser) {
        await confirmTicketOwner(
          ownerUser.email,
          newTicket.ownedby,
          newTicket.reportingmanager,
          newTicket.title
        );
      } else {
        console.log('Ticket owner not found:', newTicket.ownedby);
      }

      // 6. Return response
      res.status(201).json(newTicket);
    } catch (err: any) {
      console.error('Error creating ticket:', err);
      res.status(400).json({ error: err.message });
    }
  }

// static async create(req: Request, res: Response): Promise<void> {
//   try {
//     const file = req.file?.filename;

//     // 1. Create ticket
//     const newTicket = await TicketService.createTicket({
//       ...req.body,
//       attachment: file || null,
//     });

//     // 2. Get user who created the ticket (ownedby)
//     const ownerUser = await User.findOne({
//       where: { username: newTicket.ownedby },
//     });

//     // 3. Get the reporting manager
//     const reportingManagerUser = await User.findOne({
//       where: { username: newTicket.reportingmanager },
//     });

//     // 4. Notify the reporting manager (if found)
//     if (reportingManagerUser) {
//       console.log('Reporting manager found:', reportingManagerUser.email);

//       await sendKafkaMessage('ticket-alerts', {
//         type: 'TICKET_CREATED',
//         to: reportingManagerUser.email,
//         subject: `New Ticket Created: ${newTicket.title}`,
//         body: `Dear ${newTicket.reportingmanager},

// A new support ticket has been created by **${newTicket.ownedby}** with the following title:  
// **"${newTicket.title}"**

// ${newTicket.comments || 'No comments were provided.'}

// Please review the ticket at your earliest convenience.

// Regards,  
// Ticketing System`,
//       });
//     } else {
//       console.log('Reporting manager not found:', newTicket.reportingmanager);
//     }

//     // 5. Send confirmation to the ticket owner (if found)
//     if (ownerUser) {
//       await sendKafkaMessage('ticket-alerts', {
//         type: 'TICKET_CONFIRMATION',
//         to: ownerUser.email,
//         subject: `Ticket Submitted: ${newTicket.title}`,
//         body: `Dear ${newTicket.ownedby},

// Your ticket has been successfully submitted.

// Ticket Title: **"${newTicket.title}"**  
// Reporting Manager: **${newTicket.reportingmanager}**

// Please wait for your manager to review and take necessary actions.

// Regards,  
// Ticketing System`,
//       });
//     } else {
//       console.log('Ticket owner not found:', newTicket.ownedby);
//     }

//     // 6. Final response
//     res.status(201).json(newTicket);
//   } catch (err: any) {
//     console.error('Error creating ticket:', err);
//     res.status(400).json({ error: err.message });
//   }
// }

// static async create(req: Request, res: Response): Promise<void> {
//   try {
//     const file = req.file?.filename;

//     const newTicket = await TicketService.createTicket({
//       ...req.body,
//       attachment: file || null,
//     });

//     res.status(201).json(newTicket);
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// }


static async getAllParentTicketsWithChildren(req: Request, res: Response): Promise<void> {
  try {
    const loggedInUsername = (req.user as any)?.username; // from token
    if (!loggedInUsername) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const tickets = await TicketService.getAllParentTicketsWithChildren({
      ownedby: loggedInUsername // filter by username
    });

    const formatted = tickets.map(ticket => ({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      childTickets: ticket.childTickets?.map(child => ({
        id: child.id,
        title: child.title,
        description: child.description,
        status: child.status,
        reportingmanager: child.reportingmanager,
        priority: child.priority,
        parentId: child.parentId,
        createdAt: child.createdAt,
        updatedAt: child.updatedAt,
      })) || []
    }));

    res.status(200).json(formatted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}


// static async getAllParentTicketsWithChildren(req: Request, res: Response): Promise<void> {
//   try {
//     const tickets = await TicketService.getAllParentTicketsWithChildren();

//     const formatted = tickets.map(ticket => ({
//       id: ticket.id,
//       title: ticket.title,
//       description: ticket.description,
//       status: ticket.status,
//       priority: ticket.priority,
//       createdAt: ticket.createdAt,
//       updatedAt: ticket.updatedAt,
//       childTickets: ticket.childTickets?.map(child => ({
//         id: child.id,
//         title: child.title,
//         description: child.description,
//         status: child.status,
//         reportingmanager: child.reportingmanager,
//         priority: child.priority,
//         parentId: child.parentId,
//         createdAt: child.createdAt,
//         updatedAt: child.updatedAt,
//       })) || []
//     }));
// console.log("response",formatted)
//     res.status(200).json(formatted);
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// }



  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const tickets = await TicketService.getAllTickets();
      res.status(200).json(tickets);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

 static async getById(req: Request, res: Response): Promise<Response> {
  try {
    const ticket = await TicketService.getTicketById(+req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    return res.status(200).json(ticket);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}


  static async update(req: Request, res: Response): Promise<void> {
    try {
      const updatedTicket = await TicketService.updateTicket(+req.params.id, req.body);
      res.status(200).json(updatedTicket);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async remove(req: Request, res: Response): Promise<void> {
    try {
      const result = await TicketService.deleteTicket(+req.params.id);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
