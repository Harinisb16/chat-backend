// src/services/ticket.service.ts
import { WhereOptions } from 'sequelize';
import { ChildTicket } from '../models/childticket.model';
import { Ticket } from '../models/ticket.model';

export class TicketService {

// static async getAllParentTicketsWithChildren() {
//   console.log('Fetching all parent tickets with their children...'); // ✅ custom log

//   const tickets = await Ticket.findAll({
//     include: [
//       {
//         model: ChildTicket,
//         as: 'childTickets',
//         required: false
//       }
//     ],
//   });

//   console.log('Fetched tickets count:', tickets.length); // ✅ confirm result

//   return tickets;
// }
// TicketService.ts
static async getAllParentTicketsWithChildren(filter: { ownedby?: string } = {}) {
  return Ticket.findAll({
    where: filter, // filters by ownedby if provided
    include: [{ model: ChildTicket, as: 'childTickets' }],
  });
}



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

//   // Accepts optional filter object
// static async getAllTickets(filter: WhereOptions<Ticket> = {}) {
//   return Ticket.findAll({ where: filter });
// }

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
