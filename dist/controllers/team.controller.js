"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeam = exports.updateTeam = exports.getTeamById = exports.getAllTeams = exports.createTeam = exports.createTeamWithUsers = exports.assignUsersToTeam = void 0;
const team_model_1 = require("../models/team.model");
const teamuser_model_1 = require("../models/teamuser.model");
const user_model_1 = __importDefault(require("../models/user.model"));
const project_model_1 = __importDefault(require("../models/project.model"));
const socket_config_1 = require("../config/socket.config");
// export const getTeamDetailsWithUsers = async (req: Request, res: Response) => {
//   const { teamId } = req.params;
//   try {
//     const teamUsers = await TeamUser.findAll({
//       where: { teamId: +teamId },
//       include: [
//         {
//           model: User,
//           attributes: ['userId', 'userName']
//         },
//         {
//           model: Team,
//           attributes: ['teamId', 'teamName', 'teamLead']
//         },
//         {
//           model: Project,
//           attributes: ['projectId', 'projectName', 'description']
//         }
//       ]
//     });
//     if (!teamUsers.length) {
//       return res.status(404).json({ message: 'Team not found or no users' });
//     }
//     const result = {
//       teamId: teamUsers[0].team.teamId,
//       teamName: teamUsers[0].team.teamName,
//       teamLead: teamUsers[0].team.teamLead,
//       project: teamUsers[0].project,
//       users: teamUsers.map((entry) => ({
//         userId: entry.user.userId,
//         userName: entry.user.username
//       }))
//     };
//     return res.status(200).json(result);
//   } catch (error) {
//     console.error('Error fetching team data:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };
const assignUsersToTeam = async (req, res) => {
    try {
        const { userIds, teamId, projectId } = req.body;
        if (!userIds || !teamId || !projectId) {
            return res.status(400).json({ message: 'userIds, teamId, and projectId are required' });
        }
        const records = userIds.map((userId) => ({
            userId,
            teamId,
            projectId,
        }));
        const createdRecords = await teamuser_model_1.TeamUser.bulkCreate(records);
        res.status(201).json({
            message: 'Users successfully assigned to the team',
            data: createdRecords,
        });
    }
    catch (error) {
        console.error('Error assigning users to team:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message // Add this line for clarity
        });
    }
};
exports.assignUsersToTeam = assignUsersToTeam;
const createTeamWithUsers = async (req, res) => {
    const { teamName, projectId, userIds } = req.body;
    if (!teamName || !projectId || !Array.isArray(userIds)) {
        return res.status(400).json({ message: 'teamName, projectId, and userIds are required' });
    }
    try {
        // Check if users exist
        const existingUsers = await user_model_1.default.findAll({
            where: { userId: userIds },
            attributes: ['userId'],
        });
        const existingUserIds = existingUsers.map(user => user.userId);
        const invalidUserIds = userIds.filter(id => !existingUserIds.includes(id));
        if (invalidUserIds.length > 0) {
            return res.status(400).json({
                message: 'Some userIds do not exist',
                invalidUserIds,
            });
        }
        // Create team
        const team = await team_model_1.Team.create({ teamName, projectId });
        // Assign users
        const teamUserRecords = userIds.map((userId) => ({
            userId,
            teamId: team.id,
            projectId,
        }));
        await teamuser_model_1.TeamUser.bulkCreate(teamUserRecords);
        // Return full team with users and project
        const fullTeam = await team_model_1.Team.findByPk(team.id, { include: [project_model_1.default, user_model_1.default] });
        // Emit WebSocket event
        const io = (0, socket_config_1.getIO)();
        if (io) {
            io.emit('team:created', fullTeam); // renamed event to 'team:created' for clarity
            console.log('WebSocket event emitted:', fullTeam);
        }
        else {
            console.warn('Socket.IO instance not found. Event not emitted.');
        }
        res.status(201).json({
            message: 'Team created and users assigned successfully',
            team: fullTeam,
        });
    }
    catch (error) {
        console.error('Error creating team with users:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.createTeamWithUsers = createTeamWithUsers;
const createTeam = async (req, res) => {
    try {
        const team = await team_model_1.Team.create(req.body);
        res.status(201).json(team);
        const io = (0, socket_config_1.getIO)(); // Get the Socket.IO server instance
        io.emit('user:created', team); // Broadcast to all connected client
        console.log('WebSocket event emitted:', team);
    }
    catch (err) {
        res.status(500).json({ error: 'Error creating team' });
    }
};
exports.createTeam = createTeam;
const getAllTeams = async (_, res) => {
    try {
        const teams = await team_model_1.Team.findAll({ include: [project_model_1.default, user_model_1.default] });
        res.status(200).json(teams);
    }
    catch (err) {
        res.status(500).json({ error: 'Error fetching teams' });
    }
};
exports.getAllTeams = getAllTeams;
const getTeamById = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await team_model_1.Team.findByPk(id, {
            include: [project_model_1.default, user_model_1.default],
        });
        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }
        res.status(200).json(team);
    }
    catch (err) {
        res.status(500).json({ error: "Error fetching team" });
    }
};
exports.getTeamById = getTeamById;
// export const getTeamById = async (req: Request, res: Response) => {
//   try {
//     const team = await Team.findByPk(req.params.id, { include: [Project, User] });
//     if (!team) return res.status(404).json({ error: 'Team not found' });
//     res.status(200).json(team);
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching team' });
//   }
// };
const updateTeam = async (req, res) => {
    try {
        const team = await team_model_1.Team.findByPk(req.params.id, {
            include: [project_model_1.default, user_model_1.default],
        });
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }
        const { teamName, projectId, description, userIds } = req.body;
        // Update team basic fields
        await team.update({ teamName, projectId });
        // Update project description if projectId is provided
        if (projectId && description) {
            const project = await project_model_1.default.findByPk(projectId);
            if (project) {
                await project.update({ description });
            }
        }
        // Update team users (many-to-many)
        if (Array.isArray(userIds)) {
            await team.$set('users', userIds); // This updates TeamUser table
        }
        const updatedTeam = await team_model_1.Team.findByPk(req.params.id, {
            include: [project_model_1.default, user_model_1.default],
        });
        res.status(200).json(updatedTeam);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating team' });
    }
};
exports.updateTeam = updateTeam;
const deleteTeam = async (req, res) => {
    try {
        const team = await team_model_1.Team.findByPk(req.params.id);
        if (!team)
            return res.status(404).json({ error: 'Team not found' });
        await team.destroy();
        res.status(200).json({ message: 'Team deleted' });
    }
    catch (err) {
        res.status(500).json({ error: 'Error deleting team' });
    }
};
exports.deleteTeam = deleteTeam;
