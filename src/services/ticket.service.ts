import { WhereOptions } from 'sequelize';
import { Ticket } from '../models/ticket.model';
import { ChildTicket } from '../models/childticket.model';

export class TicketService {

  // Create a new ticket
  static async createTicket(data: Partial<Ticket>): Promise<Ticket> {
    return Ticket.create(data);
  }

  // Get all tickets with optional filter (e.g. ownedby)
  static async getAllTickets(filter: WhereOptions<Ticket> = {}): Promise<Ticket[]> {
    return Ticket.findAll({ where: filter });
  }
static async getParentwithchildticket(filter: WhereOptions<Ticket> = {}): Promise<Ticket[]> {
  return Ticket.findAll({
    where: filter,
    include: [
      {
        model: ChildTicket,
        as: "childTickets",   // ✅ must match @HasMany alias
      },
    ],
  });
}


  // Get ticket by primary key (id)
  static async getTicketById(id: number): Promise<Ticket | null> {
    return Ticket.findByPk(id);
  }

  // Update ticket by id
  static async updateTicket(id: number, data: Partial<Ticket>): Promise<Ticket> {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) throw new Error('Ticket not found');
    return ticket.update(data);
  }

  // Delete ticket by id
  static async deleteTicket(id: number): Promise<{ message: string }> {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) throw new Error('Ticket not found');
    await ticket.destroy();
    return { message: 'Ticket deleted successfully' };
  }

  // Get all parent tickets with their children (optionally filtered by ownedby)
  static async getAllParentTicketsWithChildren(filter: WhereOptions<Ticket> = {}): Promise<Ticket[]> {
    return Ticket.findAll({
      where: filter,
      include: [{ model: ChildTicket, as: 'childTickets' }],
    });
  }

  // Get child tickets by parent ticket ID
  static async getChildTicketsByParentId(parentId: number): Promise<ChildTicket[]> {
    const parent = await Ticket.findByPk(parentId, {
      include: [{ model: ChildTicket, as: 'childTickets' }],
    });
    if (!parent) throw new Error('Parent ticket not found');

    // childTickets is the relation alias, return the children
    return parent.childTickets;
  }
}
