"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTeamUsersController = exports.createTeamUserController = void 0;
const teamUser_service_1 = require("../services/teamUser.service");
const createTeamUserController = async (req, res) => {
    try {
        const { userIds, teamId, projectId } = req.body;
        if (!Array.isArray(userIds) || !teamId || !projectId) {
            return res.status(400).json({ error: 'Invalid input. Provide userIds, teamId, and projectId' });
        }
        const response = await (0, teamUser_service_1.createTeamUser)(userIds, teamId, projectId);
        res.status(201).json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create team user', message: error.message });
    }
};
exports.createTeamUserController = createTeamUserController;
const getAllTeamUsersController = async (_req, res) => {
    try {
        const data = await (0, teamUser_service_1.getAllTeamUsers)();
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch team users', message: error.message });
    }
};
exports.getAllTeamUsersController = getAllTeamUsersController;
