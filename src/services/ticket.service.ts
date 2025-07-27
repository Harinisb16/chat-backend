// src/services/ticket.service.ts
import { ChildTicket } from '../models/childticket.model';
import { Ticket } from '../models/ticket.model';

export class TicketService {


    static async getChildTicketsByParentId(parentId: number) {
    const parent = await Ticket.findByPk(parentId, {
      include: [ChildTicket],
    });
    if (!parent) throw new Error('Parent ticket not found');

    return parent.childTickets; 
  }


  static async createTicket(data: any) {
    return Ticket.create(data);
  }

  static async getAllTickets() {
    return Ticket.findAll();
  }

  static async getTicketById(id: number) {
    return Ticket.findByPk(id);
  }

  static async updateTicket(id: number, data: any) {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) throw new Error('Ticket not found');
    return ticket.update(data);
  }

  static async deleteTicket(id: number) {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) throw new Error('Ticket not found');
    await ticket.destroy();
    return { message: 'Ticket deleted successfully' };
  }
}
