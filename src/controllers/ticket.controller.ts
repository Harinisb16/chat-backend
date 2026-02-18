// import { Request, Response } from 'express';
// import { TicketService } from '../services/ticket.service';
// import User from '../models/user.model';
// import { notifyReportingManager, confirmTicketOwner } from '../services/notificationService';
// import { getIO } from '../config/socket.config';
// import { ChildTicket } from '../models/childticket.model';
// import { Ticket } from '../models/ticket.model';
// import { Op } from 'sequelize';

// export class TicketController {
  
//   // Create ticket with multiple file attachments
// static async create(req: Request, res: Response): Promise<void> {
//   try {
//     const files = (req.files as Express.Multer.File[]) || [];
//     const fileNames = files.map(file => file.filename);

//     const newTicket = await TicketService.createTicket({
//       ...req.body,
//       attachments: fileNames,
//     });

//     // Notify reporting manager and confirm owner
//     const ownerUser = await User.findOne({ where: { username: newTicket.ownedby } });
//     const reportingManagerUser = await User.findOne({ where: { username: newTicket.reportingmanager } });

//     if (reportingManagerUser) {
//       await notifyReportingManager(
//         reportingManagerUser.email,
//         newTicket.ownedby,
//         newTicket.reportingmanager,
//         newTicket.title,
//         newTicket.comments
//       );
//     }

//     if (ownerUser) {
//       await confirmTicketOwner(
//         ownerUser.email,
//         newTicket.ownedby,
//         newTicket.reportingmanager,
//         newTicket.title
//       );
//     }

//     // Emit WebSocket event
//     try {
//       const io = getIO();
//       if (io) {
//         io.emit('ticket:created', newTicket); // broadcast new ticket event
//         console.log('WebSocket event emitted:', newTicket);
//       }
//     } catch (wsError) {
//       console.warn('Failed to emit WebSocket event:', wsError);
//     }

//     res.status(201).json(newTicket);
//   } catch (err) {
//     const message = err instanceof Error ? err.message : 'Unknown error';
//     res.status(400).json({ error: message });
//   }
// }
//   // Get all tickets
//   static async getAll(req: Request, res: Response): Promise<void> {
//     try {
//       const tickets = await TicketService.getAllTickets();
//       res.status(200).json(tickets);
//     } catch (err) {
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   }



//   static async getTicketsGroupedBySprint(req: Request, res: Response) {
//     try {
//       const data = await TicketService.getTicketsGroupedBySprint();
//       res.status(200).json(data);
//     } catch (err: any) {
//       res.status(500).json({ error: err.message });
//     }
//   }
  
// static async getParentwithchildticket(req: Request, res: Response): Promise<void> {
//   try {
//     const { id } = req.params;

//     const tickets = await TicketService.getParentwithchildticket({ id: Number(id) });

//     if (!tickets || tickets.length === 0) {
//       res.status(404).json({ message: "Ticket not found" });
//       return;
//     }

//     res.status(200).json(tickets[0]); // return a single parent with its children
//   } catch (err) {
//     console.error("Error fetching tickets:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }
// // TicketController.ts
//   static async updateParentwithchildticket(req: Request, res: Response): Promise<void> {
//     try {
//       // --- Type-safe handling of req.files ---
//       const files = req.files;
//       let parentFiles: Express.Multer.File[] = [];
//       let childFiles: Express.Multer.File[] = [];

//       if (files && !Array.isArray(files)) {
//         // files is { [fieldname: string]: File[] }
//         parentFiles = files["attachments"] || [];
//         childFiles = files["childAttachments"] || [];
//       }

//       // --- Fetch existing ticket ---
//       const existingTicket = await TicketService.getTicketById(+req.params.id);
//       if (!existingTicket) {
//         res.status(404).json({ error: "Ticket not found" });
//         return;
//       }

//       // --- Parse FormData fields ---
//       const bodyData: any = {};
//       for (const key in req.body) {
//         try {
//           bodyData[key] = JSON.parse(req.body[key]); // parse JSON strings
//         } catch {
//           bodyData[key] = req.body[key]; // fallback to string
//         }
//       }

//       // --- Merge parent attachments ---
//       const updatedParentAttachments = [
//         ...(existingTicket.attachments || []), // keep old attachments
//         ...parentFiles.map((f) => f.filename), // add new files
//       ];

//       // --- Merge child tickets ---
//       const updatedChildren = (bodyData.childTickets || []).map((child: any) => {
//         const existingChild = (existingTicket.childTickets || []).find((c) => c.id === child.id);

//         // Attach all uploaded child files (you can refine by child ID if needed)
//         const newChildFiles = childFiles.map((f) => f.filename);

//         return {
//           ...child,
//           attachments: [
//             ...(existingChild?.attachments || []),
//             ...newChildFiles,
//           ],
//         };
//       });

//       // --- Final update object ---
//       const updatedData = {
//         ...bodyData,
//         attachments: updatedParentAttachments,
//         childTickets: updatedChildren,
//       };

//       // --- Call service to update ---
//       const updatedTicket = await TicketService.updateTicket(+req.params.id, updatedData);
//       res.status(200).json(updatedTicket);
//     } catch (err) {
//       res.status(400).json({
//         error: err instanceof Error ? err.message : "Bad Request",
//       });
//     }
//   }



//   // Get ticket by id
//   static async getById(req: Request, res: Response): Promise<void> {
//     try {
//       const ticket = await TicketService.getTicketById(+req.params.id);
//       if (!ticket) {
//         res.status(404).json({ error: 'Ticket not found' });
//         return;
//       }
//       res.status(200).json(ticket);
//     } catch (err) {
//       res.status(400).json({ error: err instanceof Error ? err.message : 'Bad Request' });
//     }
//   }

//   // Update ticket with possible new attachments
//   static async update(req: Request, res: Response): Promise<void> {
//     try {
//       const files = (req.files as Express.Multer.File[]) || [];
//       const fileNames = files.map(file => file.filename);

//       // Fetch existing ticket to merge attachments if needed
//       const existingTicket = await TicketService.getTicketById(+req.params.id);
//       if (!existingTicket) {
//         res.status(404).json({ error: 'Ticket not found' });
//         return;
//       }

//       // Merge old attachments with new ones or replace entirely
//       // You can customize logic here: merge, replace, or remove specific files
//       const updatedAttachments = fileNames.length > 0 
//         ? [...(existingTicket.attachments || []), ...fileNames]
//         : existingTicket.attachments;

//       // Prepare updated data object
//       const updatedData = {
//         ...req.body,
//         attachments: updatedAttachments,
//       };

//       const updatedTicket = await TicketService.updateTicket(+req.params.id, updatedData);
//       res.status(200).json(updatedTicket);
//     } catch (err) {
//       res.status(400).json({ error: err instanceof Error ? err.message : 'Bad Request' });
//     }
//   }

//   // Delete ticket by id
//   static async remove(req: Request, res: Response): Promise<void> {
//     try {
//       const result = await TicketService.deleteTicket(+req.params.id);
//       res.status(200).json(result);
//     } catch (err) {
//       res.status(400).json({ error: err instanceof Error ? err.message : 'Bad Request' });
//     }
//   }
  
//   // Additional example: get tickets owned by logged in user
//   static async getMyTickets(req: Request, res: Response): Promise<void> {
//     try {
//       if (!req.user) {
//         res.status(401).json({ error: 'Unauthorized' });
//         return;
//       }
//       const tickets = await TicketService.getAllTickets({ ownedby: req.user.username });
//       res.status(200).json(tickets);
//     } catch (err) {
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   }

//   // Additional example: get child tickets for a parent ticket
//   static async getChildTicketsByParentId(req: Request, res: Response): Promise<void> {
//     try {
//       const parentId = +req.params.parentId;
//       const children = await TicketService.getChildTicketsByParentId(parentId);
//       res.status(200).json(children);
//     } catch (err) {
//       res.status(404).json({ error: err instanceof Error ? err.message : 'Not found' });
//     }
//   }


// static async removeAttachment(req: Request, res: Response): Promise<void> {
//   try {
//     const ticketId = Number(req.params.id);
//     const fileName = req.params.fileName;

//     const ticket = await Ticket.findByPk(ticketId);
//     if (!ticket) {
//       res.status(404).json({ error: "Ticket not found" });
//       return;
//     }

//     // Remove the file from the DB (attachments is JSON array)
//     ticket.attachments = (ticket.attachments || []).filter(
//       (f: string) => f !== fileName
//     );

//     await ticket.save();

//     // (Optional) also remove file physically from server
//     // fs.unlinkSync(path.join(__dirname, "../uploads", fileName));

//     res.json({ message: "Attachment deleted successfully" });
//   } catch (err) {
//     res.status(400).json({ error: err instanceof Error ? err.message : "Bad Request" });
//   }
// }


// }


import { Request, Response } from "express";
import { TicketService } from "../services/ticket.service";
import User from "../models/user.model";
import { notifyReportingManager, confirmTicketOwner } from "../services/notificationService";
import { getIO } from "../config/socket.config";
import { Ticket } from "../models/ticket.model";

export class TicketController {

  // ================= DATE FIX =================
  private static fixDate(value: any): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  // ================= CREATE =================
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const files = (req.files as Express.Multer.File[]) || [];
      const fileNames = files.map(f => f.filename);
      const body = req.body;

      const newTicket = await TicketService.createTicket({
        ...body,
        startDate: TicketController.fixDate(body.startDate),
        endDate: TicketController.fixDate(body.endDate),
        dueDate: TicketController.fixDate(body.dueDate),
        createdAt: TicketController.fixDate(body.createdAt) || new Date(),
        updatedAt: new Date(),
        attachments: fileNames,
      });

      const ownerUser = await User.findOne({ where: { username: newTicket.ownedby } });
      const reportingManagerUser = await User.findOne({ where: { username: newTicket.reportingmanager } });

      if (reportingManagerUser) {
        await notifyReportingManager(reportingManagerUser.email, newTicket.ownedby, newTicket.reportingmanager, newTicket.title, newTicket.comments);
      }

      if (ownerUser) {
        await confirmTicketOwner(ownerUser.email, newTicket.ownedby, newTicket.reportingmanager, newTicket.title);
      }

      getIO()?.emit("ticket:created", newTicket);
      res.status(201).json(newTicket);
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  }

  // ================= GET ALL =================
  static async getAll(req: Request, res: Response) {
    try {
      const tickets = await TicketService.getAllTickets();
      res.status(200).json(tickets);
    } catch {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // ================= GROUP BY SPRINT =================
  static async getTicketsGroupedBySprint(req: Request, res: Response) {
    try {
      const data = await TicketService.getTicketsGroupedBySprint();
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // ================= GET BY ID =================
  static async getById(req: Request, res: Response) {
    try {
      const ticket = await TicketService.getTicketById(+req.params.id);
      if (!ticket) return res.status(404).json({ error: "Ticket not found" });
      res.status(200).json(ticket);
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Bad Request" });
    }
  }

  // ================= MY TICKETS =================
  static async getMyTickets(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const tickets = await TicketService.getAllTickets({ ownedby: req.user.username });
      res.status(200).json(tickets);
    } catch {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // ================= PARENT WITH CHILD =================
  static async getParentwithchildticket(req: Request, res: Response) {
    try {
      const tickets = await TicketService.getParentwithchildticket({ id: Number(req.params.id) });
      if (!tickets.length) return res.status(404).json({ message: "Ticket not found" });
      res.status(200).json(tickets[0]);
    } catch {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // ================= CHILD TICKETS =================
  static async getChildTicketsByParentId(req: Request, res: Response) {
    try {
      const children = await TicketService.getChildTicketsByParentId(+req.params.parentId);
      res.status(200).json(children);
    } catch (err) {
      res.status(404).json({ error: err instanceof Error ? err.message : "Not found" });
    }
  }

  // ================= UPDATE PARENT + CHILD =================
  static async updateParentwithchildticket(req: Request, res: Response) {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const parentFiles = files?.["attachments"] || [];
      const childFiles = files?.["childAttachments"] || [];

      const existingTicket = await TicketService.getTicketById(+req.params.id);
      if (!existingTicket) return res.status(404).json({ error: "Ticket not found" });

      const bodyData: any = {};
      for (const key in req.body) {
        try { bodyData[key] = JSON.parse(req.body[key]); }
        catch { bodyData[key] = req.body[key]; }
      }

      const updatedParentAttachments = [
        ...(existingTicket.attachments || []),
        ...parentFiles.map(f => f.filename),
      ];

      const updatedChildren = (bodyData.childTickets || []).map((child: any) => {
        const existingChild = (existingTicket.childTickets || []).find((c: any) => c.id === child.id);
        return {
          ...child,
          attachments: [
            ...(existingChild?.attachments || []),
            ...childFiles.map(f => f.filename),
          ],
        };
      });

      const updatedData = {
        ...bodyData,
        startDate: TicketController.fixDate(bodyData.startDate),
        endDate: TicketController.fixDate(bodyData.endDate),
        dueDate: TicketController.fixDate(bodyData.dueDate),
        updatedAt: new Date(),
        attachments: updatedParentAttachments,
        childTickets: updatedChildren,
      };

      const updatedTicket = await TicketService.updateTicket(+req.params.id, updatedData);
      res.status(200).json(updatedTicket);
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Bad Request" });
    }
  }

  // ================= UPDATE SIMPLE =================
  static async update(req: Request, res: Response) {
    try {
      const files = (req.files as Express.Multer.File[]) || [];
      const fileNames = files.map(f => f.filename);

      const existingTicket = await TicketService.getTicketById(+req.params.id);
      if (!existingTicket) return res.status(404).json({ error: "Ticket not found" });

      const updatedAttachments = fileNames.length
        ? [...(existingTicket.attachments || []), ...fileNames]
        : existingTicket.attachments;

      const updatedData = {
        ...req.body,
        startDate: TicketController.fixDate(req.body.startDate),
        endDate: TicketController.fixDate(req.body.endDate),
        dueDate: TicketController.fixDate(req.body.dueDate),
        attachments: updatedAttachments,
        updatedAt: new Date(),
      };

      const updatedTicket = await TicketService.updateTicket(+req.params.id, updatedData);
      res.status(200).json(updatedTicket);
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Bad Request" });
    }
  }

  // ================= DELETE =================
  static async remove(req: Request, res: Response) {
    try {
      const result = await TicketService.deleteTicket(+req.params.id);
      res.status(200).json(result);
    } catch {
      res.status(400).json({ error: "Bad Request" });
    }
  }

  // ================= REMOVE ATTACHMENT =================
  static async removeAttachment(req: Request, res: Response) {
    try {
      const ticket = await Ticket.findByPk(Number(req.params.id));
      if (!ticket) return res.status(404).json({ error: "Ticket not found" });

      ticket.attachments = (ticket.attachments || []).filter((f: string) => f !== req.params.fileName);
      await ticket.save();

      res.json({ message: "Attachment deleted successfully" });
    } catch {
      res.status(400).json({ error: "Bad Request" });
    }
  }
}
