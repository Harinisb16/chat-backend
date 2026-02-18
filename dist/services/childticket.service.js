"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChildTicket = exports.updateChildTicket = exports.getChildTicketById = exports.getAllChildTickets = exports.createChildTicket = void 0;
const childticket_model_1 = require("../models/childticket.model");
const ticket_model_1 = require("../models/ticket.model");
const createChildTicket = async (parentId, data) => {
    const parent = await ticket_model_1.Ticket.findByPk(parentId);
    if (!parent)
        throw new Error('Parent ticket not found');
    // Ensure attachments is an array
    if (!Array.isArray(data.attachments)) {
        data.attachments = [];
    }
    return await childticket_model_1.ChildTicket.create({ ...data, parentId });
};
exports.createChildTicket = createChildTicket;
const getAllChildTickets = async () => {
    return await childticket_model_1.ChildTicket.findAll();
};
exports.getAllChildTickets = getAllChildTickets;
const getChildTicketById = async (id) => {
    return await childticket_model_1.ChildTicket.findByPk(id);
};
exports.getChildTicketById = getChildTicketById;
const updateChildTicket = async (id, data, newAttachments = []) => {
    const ticket = await childticket_model_1.ChildTicket.findByPk(id);
    if (!ticket)
        throw new Error('Child ticket not found');
    // Merge new attachments with existing ones
    if (newAttachments.length > 0) {
        const currentAttachments = ticket.attachments || [];
        data.attachments = [...currentAttachments, ...newAttachments];
    }
    await ticket.update(data);
    return ticket;
};
exports.updateChildTicket = updateChildTicket;
const deleteChildTicket = async (id) => {
    const ticket = await childticket_model_1.ChildTicket.findByPk(id);
    if (!ticket)
        throw new Error('Child ticket not found');
    await ticket.destroy();
    return { message: 'Deleted successfully' };
};
exports.deleteChildTicket = deleteChildTicket;
