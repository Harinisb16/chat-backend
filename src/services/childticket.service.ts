import { ChildTicket } from '../models/childticket.model';
import { Ticket } from '../models/ticket.model';

export const createChildTicket = async (parentId: number, data: Partial<ChildTicket>) => {
  const parent = await Ticket.findByPk(parentId);
  if (!parent) throw new Error('Parent ticket not found');

  // Ensure attachments is an array
  if (!Array.isArray(data.attachments)) {
    data.attachments = [];
  }

  return await ChildTicket.create({ ...data, parentId });
};

export const getAllChildTickets = async () => {
  return await ChildTicket.findAll();
};

export const getChildTicketById = async (id: number) => {
  return await ChildTicket.findByPk(id);
};

export const updateChildTicket = async (
  id: number,
  data: Partial<ChildTicket>,
  newAttachments: string[] = []
) => {
  const ticket = await ChildTicket.findByPk(id);
  if (!ticket) throw new Error('Child ticket not found');

  // Merge new attachments with existing ones
  if (newAttachments.length > 0) {
    const currentAttachments = ticket.attachments || [];
    data.attachments = [...currentAttachments, ...newAttachments];
  }

  await ticket.update(data);
  return ticket;
};

export const deleteChildTicket = async (id: number) => {
  const ticket = await ChildTicket.findByPk(id);
  if (!ticket) throw new Error('Child ticket not found');

  await ticket.destroy();
  return { message: 'Deleted successfully' };
};
