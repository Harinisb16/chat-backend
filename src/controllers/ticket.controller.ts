// src/controllers/ticket.controller.ts
import { Request, Response } from 'express';
import { TicketService } from '../services/ticket.service';
import { Ticket } from '../models/ticket.model';

export class TicketController {

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

    const newTicket = await TicketService.createTicket({
      ...req.body,
      attachment: file || null,
    });

    res.status(201).json(newTicket);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}


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
