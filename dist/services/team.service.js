"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeam = exports.updateTeam = exports.getAllTeams = exports.createTeam = void 0;
const team_model_1 = require("../models/team.model");
const createTeam = async (data) => {
    return await team_model_1.Team.create(data);
};
exports.createTeam = createTeam;
const getAllTeams = async () => {
    return await team_model_1.Team.findAll();
};
exports.getAllTeams = getAllTeams;
const updateTeam = async (id, data) => {
    await team_model_1.Team.update(data, { where: { teamId: id } });
    return await team_model_1.Team.findByPk(id);
};
exports.updateTeam = updateTeam;
const deleteTeam = async (id) => {
    await team_model_1.Team.destroy({ where: { teamId: id } });
};
exports.deleteTeam = deleteTeam;
