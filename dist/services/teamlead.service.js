"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamleadService = exports.TeamLeadService = void 0;
const teamleaddetail_model_1 = require("../models/teamleaddetail.model");
class TeamLeadService {
    async createTeamLead(data) {
        return await teamleaddetail_model_1.TeamLead.create(data);
    }
    async getAllTeamLead() {
        return await teamleaddetail_model_1.TeamLead.findAll();
    }
    async getTeamLeadById(id) {
        return await teamleaddetail_model_1.TeamLead.findByPk(id);
    }
    async updateTeamLead(id, data) {
        const user = await teamleaddetail_model_1.TeamLead.findByPk(id);
        if (!user)
            throw new Error('User not found');
        return await user.update(data);
    }
    async deleteTeamLead(id) {
        const user = await teamleaddetail_model_1.TeamLead.findByPk(id);
        if (!user)
            throw new Error('TeamLead not found');
        await user.destroy();
        return { message: 'TeamLead deleted successfully' };
    }
}
exports.TeamLeadService = TeamLeadService;
exports.teamleadService = new TeamLeadService();
