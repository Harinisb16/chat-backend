
import { ChildTicket } from '../models/childticket.model';
import { Ticket } from '../models/ticket.model';


export const createChildTicket = async (parentId: number, data: Partial<ChildTicket>) => {
  const parent = await Ticket.findByPk(parentId);
  if (!parent) throw new Error('Parent ticket not found');

  return await ChildTicket.create({ ...data, parentId });
};

export const getAllChildTickets = async () => {
  return await ChildTicket.findAll();
};

export const getChildTicketById = async (id: number) => {
  return await ChildTicket.findByPk(id);
};

export const updateChildTicket = async (id: number, data: Partial<ChildTicket>) => {
  const ticket = await ChildTicket.findByPk(id);
  if (!ticket) throw new Error('Child ticket not found');

  await ticket.update(data);
  return ticket;
};

export const deleteChildTicket = async (id: number) => {
  const ticket = await ChildTicket.findByPk(id);
  if (!ticket) throw new Error('Child ticket not found');

  await ticket.destroy();
  return { message: 'Deleted successfully' };
};
