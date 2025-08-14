import { Request, Response } from 'express';
import * as ChildTicketService from '../services/childticket.service';

export const createChildTicket = async (req: Request, res: Response) => {
  try {
    const parentId = parseInt(req.params.parentId);

    // Extract form fields
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

    // Handle multiple attachments
    let attachments: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      attachments = (req.files as Express.Multer.File[]).map(file => file.filename);
    }

    const ticket = await ChildTicketService.createChildTicket(parentId, {
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
      ownedby,
      attachments
    });

    res.status(201).json(ticket);
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

    let newAttachments: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      newAttachments = (req.files as Express.Multer.File[]).map(file => file.filename);
    }

    // Old attachments from the form
    const existingAttachments = Array.isArray(req.body.existingAttachments)
      ? req.body.existingAttachments
      : req.body.existingAttachments
      ? [req.body.existingAttachments]
      : [];

    const updated = await ChildTicketService.updateChildTicket(
      id,
      req.body,
      [...existingAttachments, ...newAttachments]
    );

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
