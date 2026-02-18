"use strict";
// import { Request, Response } from 'express';
// import { TicketService } from '../services/ticket.service';
// import User from '../models/user.model';
// import { notifyReportingManager, confirmTicketOwner } from '../services/notificationService';
// import { getIO } from '../config/socket.config';
// import { ChildTicket } from '../models/childticket.model';
// import { Ticket } from '../models/ticket.model';
// import { Op } from 'sequelize';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const ticket_service_1 = require("../services/ticket.service");
const user_model_1 = __importDefault(require("../models/user.model"));
const notificationService_1 = require("../services/notificationService");
const socket_config_1 = require("../config/socket.config");
const ticket_model_1 = require("../models/ticket.model");
class TicketController {
    // ================= DATE FIX =================
    static fixDate(value) {
        if (!value)
            return null;
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    }
    // ================= CREATE =================
    static async create(req, res) {
        try {
            const files = req.files || [];
            const fileNames = files.map(f => f.filename);
            const body = req.body;
            const newTicket = await ticket_service_1.TicketService.createTicket({
                ...body,
                startDate: TicketController.fixDate(body.startDate),
                endDate: TicketController.fixDate(body.endDate),
                dueDate: TicketController.fixDate(body.dueDate),
                createdAt: TicketController.fixDate(body.createdAt) || new Date(),
                updatedAt: new Date(),
                attachments: fileNames,
            });
            const ownerUser = await user_model_1.default.findOne({ where: { username: newTicket.ownedby } });
            const reportingManagerUser = await user_model_1.default.findOne({ where: { username: newTicket.reportingmanager } });
            if (reportingManagerUser) {
                await (0, notificationService_1.notifyReportingManager)(reportingManagerUser.email, newTicket.ownedby, newTicket.reportingmanager, newTicket.title, newTicket.comments);
            }
            if (ownerUser) {
                await (0, notificationService_1.confirmTicketOwner)(ownerUser.email, newTicket.ownedby, newTicket.reportingmanager, newTicket.title);
            }
            (0, socket_config_1.getIO)()?.emit("ticket:created", newTicket);
            res.status(201).json(newTicket);
        }
        catch (err) {
            res.status(400).json({ error: err instanceof Error ? err.message : "Unknown error" });
        }
    }
    // ================= GET ALL =================
    static async getAll(req, res) {
        try {
            const tickets = await ticket_service_1.TicketService.getAllTickets();
            res.status(200).json(tickets);
        }
        catch {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    // ================= GROUP BY SPRINT =================
    static async getTicketsGroupedBySprint(req, res) {
        try {
            const data = await ticket_service_1.TicketService.getTicketsGroupedBySprint();
            res.status(200).json(data);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    // ================= GET BY ID =================
    static async getById(req, res) {
        try {
            const ticket = await ticket_service_1.TicketService.getTicketById(+req.params.id);
            if (!ticket)
                return res.status(404).json({ error: "Ticket not found" });
            res.status(200).json(ticket);
        }
        catch (err) {
            res.status(400).json({ error: err instanceof Error ? err.message : "Bad Request" });
        }
    }
    // ================= MY TICKETS =================
    static async getMyTickets(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ error: "Unauthorized" });
            const tickets = await ticket_service_1.TicketService.getAllTickets({ ownedby: req.user.username });
            res.status(200).json(tickets);
        }
        catch {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    // ================= PARENT WITH CHILD =================
    static async getParentwithchildticket(req, res) {
        try {
            const tickets = await ticket_service_1.TicketService.getParentwithchildticket({ id: Number(req.params.id) });
            if (!tickets.length)
                return res.status(404).json({ message: "Ticket not found" });
            res.status(200).json(tickets[0]);
        }
        catch {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    // ================= CHILD TICKETS =================
    static async getChildTicketsByParentId(req, res) {
        try {
            const children = await ticket_service_1.TicketService.getChildTicketsByParentId(+req.params.parentId);
            res.status(200).json(children);
        }
        catch (err) {
            res.status(404).json({ error: err instanceof Error ? err.message : "Not found" });
        }
    }
    // ================= UPDATE PARENT + CHILD =================
    static async updateParentwithchildticket(req, res) {
        try {
            const files = req.files;
            const parentFiles = files?.["attachments"] || [];
            const childFiles = files?.["childAttachments"] || [];
            const existingTicket = await ticket_service_1.TicketService.getTicketById(+req.params.id);
            if (!existingTicket)
                return res.status(404).json({ error: "Ticket not found" });
            const bodyData = {};
            for (const key in req.body) {
                try {
                    bodyData[key] = JSON.parse(req.body[key]);
                }
                catch {
                    bodyData[key] = req.body[key];
                }
            }
            const updatedParentAttachments = [
                ...(existingTicket.attachments || []),
                ...parentFiles.map(f => f.filename),
            ];
            const updatedChildren = (bodyData.childTickets || []).map((child) => {
                const existingChild = (existingTicket.childTickets || []).find((c) => c.id === child.id);
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
            const updatedTicket = await ticket_service_1.TicketService.updateTicket(+req.params.id, updatedData);
            res.status(200).json(updatedTicket);
        }
        catch (err) {
            res.status(400).json({ error: err instanceof Error ? err.message : "Bad Request" });
        }
    }
    // ================= UPDATE SIMPLE =================
    static async update(req, res) {
        try {
            const files = req.files || [];
            const fileNames = files.map(f => f.filename);
            const existingTicket = await ticket_service_1.TicketService.getTicketById(+req.params.id);
            if (!existingTicket)
                return res.status(404).json({ error: "Ticket not found" });
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
            const updatedTicket = await ticket_service_1.TicketService.updateTicket(+req.params.id, updatedData);
            res.status(200).json(updatedTicket);
        }
        catch (err) {
            res.status(400).json({ error: err instanceof Error ? err.message : "Bad Request" });
        }
    }
    // ================= DELETE =================
    static async remove(req, res) {
        try {
            const result = await ticket_service_1.TicketService.deleteTicket(+req.params.id);
            res.status(200).json(result);
        }
        catch {
            res.status(400).json({ error: "Bad Request" });
        }
    }
    // ================= REMOVE ATTACHMENT =================
    static async removeAttachment(req, res) {
        try {
            const ticket = await ticket_model_1.Ticket.findByPk(Number(req.params.id));
            if (!ticket)
                return res.status(404).json({ error: "Ticket not found" });
            ticket.attachments = (ticket.attachments || []).filter((f) => f !== req.params.fileName);
            await ticket.save();
            res.json({ message: "Attachment deleted successfully" });
        }
        catch {
            res.status(400).json({ error: "Bad Request" });
        }
    }
}
exports.TicketController = TicketController;
