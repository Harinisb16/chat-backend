import { Request, Response } from 'express';
import { TicketService } from '../services/ticket.service';
import User from '../models/user.model';
import { notifyReportingManager, confirmTicketOwner } from '../services/notificationService';
import { getIO } from '../config/socket.config';

export class TicketController {
  
  // Create ticket with multiple file attachments
static async create(req: Request, res: Response): Promise<void> {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    const fileNames = files.map(file => file.filename);

    const newTicket = await TicketService.createTicket({
      ...req.body,
      attachments: fileNames,
    });

    // Notify reporting manager and confirm owner
    const ownerUser = await User.findOne({ where: { username: newTicket.ownedby } });
    const reportingManagerUser = await User.findOne({ where: { username: newTicket.reportingmanager } });

    if (reportingManagerUser) {
      await notifyReportingManager(
        reportingManagerUser.email,
        newTicket.ownedby,
        newTicket.reportingmanager,
        newTicket.title,
        newTicket.comments
      );
    }

    if (ownerUser) {
      await confirmTicketOwner(
        ownerUser.email,
        newTicket.ownedby,
        newTicket.reportingmanager,
        newTicket.title
      );
    }

    // Emit WebSocket event
    try {
      const io = getIO();
      if (io) {
        io.emit('ticket:created', newTicket); // broadcast new ticket event
        console.log('WebSocket event emitted:', newTicket);
      }
    } catch (wsError) {
      console.warn('Failed to emit WebSocket event:', wsError);
    }

    res.status(201).json(newTicket);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
}
  // Get all tickets
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const tickets = await TicketService.getAllTickets();
      res.status(200).json(tickets);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Get ticket by id
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const ticket = await TicketService.getTicketById(+req.params.id);
      if (!ticket) {
        res.status(404).json({ error: 'Ticket not found' });
        return;
      }
      res.status(200).json(ticket);
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : 'Bad Request' });
    }
  }

  // Update ticket with possible new attachments
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const files = (req.files as Express.Multer.File[]) || [];
      const fileNames = files.map(file => file.filename);

      // Fetch existing ticket to merge attachments if needed
      const existingTicket = await TicketService.getTicketById(+req.params.id);
      if (!existingTicket) {
        res.status(404).json({ error: 'Ticket not found' });
        return;
      }

      // Merge old attachments with new ones or replace entirely
      // You can customize logic here: merge, replace, or remove specific files
      const updatedAttachments = fileNames.length > 0 
        ? [...(existingTicket.attachments || []), ...fileNames]
        : existingTicket.attachments;

      // Prepare updated data object
      const updatedData = {
        ...req.body,
        attachments: updatedAttachments,
      };

      const updatedTicket = await TicketService.updateTicket(+req.params.id, updatedData);
      res.status(200).json(updatedTicket);
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : 'Bad Request' });
    }
  }

  // Delete ticket by id
  static async remove(req: Request, res: Response): Promise<void> {
    try {
      const result = await TicketService.deleteTicket(+req.params.id);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : 'Bad Request' });
    }
  }
  
  // Additional example: get tickets owned by logged in user
  static async getMyTickets(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const tickets = await TicketService.getAllTickets({ ownedby: req.user.username });
      res.status(200).json(tickets);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Additional example: get child tickets for a parent ticket
  static async getChildTicketsByParentId(req: Request, res: Response): Promise<void> {
    try {
      const parentId = +req.params.parentId;
      const children = await TicketService.getChildTicketsByParentId(parentId);
      res.status(200).json(children);
    } catch (err) {
      res.status(404).json({ error: err instanceof Error ? err.message : 'Not found' });
    }
  }
}
