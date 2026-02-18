"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamLeadController = void 0;
const teamlead_service_1 = require("../services/teamlead.service");
class TeamLeadController {
    static async create(req, res) {
        try {
            const { reportingManagerName, email } = req.body;
            if (typeof reportingManagerName !== 'string' || typeof email !== 'string') {
                return res.status(400).json({ error: 'Invalid input types' });
            }
            const user = await teamlead_service_1.teamleadService.createTeamLead({ reportingManagerName, email });
            res.status(201).json(user);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getAll(req, res) {
        try {
            const users = await teamlead_service_1.teamleadService.getAllTeamLead();
            res.status(200).json(users);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getById(req, res) {
        try {
            const user = await teamlead_service_1.teamleadService.getTeamLeadById(Number(req.params.id));
            if (!user)
                return res.status(404).json({ message: 'User not found' });
            res.status(200).json(user);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async update(req, res) {
        try {
            const updated = await teamlead_service_1.teamleadService.updateTeamLead(Number(req.params.id), req.body);
            res.status(200).json(updated);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async delete(req, res) {
        try {
            const result = await teamlead_service_1.teamleadService.deleteTeamLead(Number(req.params.id));
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.TeamLeadController = TeamLeadController;
