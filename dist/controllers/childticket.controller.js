"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAttachment = exports.deleteChildTicket = exports.updateChildTicket = exports.getChildTicketById = exports.getAllChildTickets = exports.createChildTicket = void 0;
const ChildTicketService = __importStar(require("../services/childticket.service"));
const childticket_model_1 = require("../models/childticket.model");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const createChildTicket = async (req, res) => {
    try {
        const parentId = parseInt(req.params.parentId);
        // Extract form fields
        const { title, description, type, priority, status, sprint, startdate, reportingmanager, enddate, comments, ownedby } = req.body;
        // Handle multiple attachments
        let attachments = [];
        if (req.files && Array.isArray(req.files)) {
            attachments = req.files.map(file => file.filename);
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
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.createChildTicket = createChildTicket;
const getAllChildTickets = async (_req, res) => {
    const tickets = await ChildTicketService.getAllChildTickets();
    res.json(tickets);
};
exports.getAllChildTickets = getAllChildTickets;
const getChildTicketById = async (req, res) => {
    const id = parseInt(req.params.id);
    const ticket = await ChildTicketService.getChildTicketById(id);
    if (ticket)
        res.json(ticket);
    else
        res.status(404).json({ message: 'Child ticket not found' });
};
exports.getChildTicketById = getChildTicketById;
const updateChildTicket = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let newAttachments = [];
        if (req.files && Array.isArray(req.files)) {
            newAttachments = req.files.map(file => file.filename);
        }
        // Old attachments from the form
        const existingAttachments = Array.isArray(req.body.existingAttachments)
            ? req.body.existingAttachments
            : req.body.existingAttachments
                ? [req.body.existingAttachments]
                : [];
        const updated = await ChildTicketService.updateChildTicket(id, req.body, [...existingAttachments, ...newAttachments]);
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.updateChildTicket = updateChildTicket;
const deleteChildTicket = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await ChildTicketService.deleteChildTicket(id);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.deleteChildTicket = deleteChildTicket;
const removeAttachment = async (req, res) => {
    try {
        const ticketId = Number(req.params.id);
        const fileName = req.params.fileName;
        const ticket = await childticket_model_1.ChildTicket.findByPk(ticketId);
        if (!ticket) {
            res.status(404).json({ error: "Ticket not found" });
            return;
        }
        // Remove the file from the DB
        ticket.attachments = (ticket.attachments || []).filter((f) => f !== fileName);
        await ticket.save();
        // Optional: Remove physical file
        const filePath = path_1.default.join(__dirname, "../uploads", fileName);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        res.json({ message: "Attachment deleted successfully" });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.removeAttachment = removeAttachment;
