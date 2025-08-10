// src/controllers/childticket.controller.ts
import { Request, Response } from 'express';
import * as ChildTicketService from '../services/childticket.service';

// export const createChildTicket = async (req: Request, res: Response) => {
//   try {
//     const parentId = parseInt(req.params.parentId);
//     const ticket = await ChildTicketService.createChildTicket(parentId, req.body);
//     res.status(201).json(ticket);
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// };


export const createChildTicket = async (req: Request, res: Response) => {
  try {
    const parentId = parseInt(req.params.parentId);
    const {
      title,
      description,
      type,
      priority,
      status,
      sprint,
      startdate,
      reportingmanager,
      enddate,
      comments,
      ownedby
    } = req.body;

    const attachment = req.file?.filename ?? undefined;

    const ticket = await ChildTicketService.createChildTicket(parentId, {
      title,
      description,
      type,
      priority,
      status,
      sprint,
      reportingmanager,
      startdate,
      enddate,
      comments,
      ownedby,
      attachment
    });

    const fullTicket = await ticket.reload(); // ensure all fields are loaded
    res.status(201).json(fullTicket);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllChildTickets = async (_req: Request, res: Response) => {
  const tickets = await ChildTicketService.getAllChildTickets();
  res.json(tickets);
};

export const getChildTicketById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const ticket = await ChildTicketService.getChildTicketById(id);
  if (ticket) res.json(ticket);
  else res.status(404).json({ message: 'Child ticket not found' });
};

export const updateChildTicket = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updated = await ChildTicketService.updateChildTicket(id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteChildTicket = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await ChildTicketService.deleteChildTicket(id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
