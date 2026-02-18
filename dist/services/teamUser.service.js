"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTeamUsers = exports.createTeamUser = void 0;
const teamuser_model_1 = require("../models/teamuser.model");
const user_model_1 = __importDefault(require("../models/user.model"));
const team_model_1 = require("../models/team.model");
const project_model_1 = __importDefault(require("../models/project.model"));
const createTeamUser = async (userIds, teamId, projectId) => {
    const created = await Promise.all(userIds.map((userId) => teamuser_model_1.TeamUser.create({
        userId,
        teamId,
        projectId
    })));
    return {
        ids: created.map(item => item.id),
        userIds,
        teamId,
        projectId
    };
};
exports.createTeamUser = createTeamUser;
// export const getAllTeamUsers = async () => {
//   const records = await TeamUser.findAll({
//     include: [User, Team, Project],
//     raw: false
//   });
//   const grouped = records.reduce((acc: any[], curr) => {
//     const key = `${curr.teamId}_${curr.projectId}`;
//     const existing = acc.find(item => item.key === key);
//     const userInfo = {
//       userId: curr.user.userId,
//       userName: curr.user.username
//     };
//     if (existing) {
//       if (!existing.userIds.includes(curr.user.userId)) {
//         existing.userIds.push(curr.user.userId);
//         existing.users.push(userInfo);
//       }
//     } else {
//       acc.push({
//         key,
//         id: curr.id,
//         userIds: [curr.user.userId],
//         teamId: curr.teamId,
//         projectId: curr.projectId,
//         team: {
//           teamId: curr.team.teamId,
//           teamName: curr.team.teamName,
//           teamLead: curr.team.teamLead,
//           projectId: curr.team.projectId
//         },
//         project: {
//           projectId: curr.project.projectId,
//           projectName: curr.project.projectName,
//           description: curr.project.description
//         },
//         users: [userInfo]
//       });
//     }
//     return acc;
//   }, []);
//   return grouped;
// };
const getAllTeamUsers = async () => {
    const records = await teamuser_model_1.TeamUser.findAll({
        include: [user_model_1.default, team_model_1.Team, project_model_1.default],
    });
    const grouped = records.reduce((acc, curr) => {
        const key = `${curr.teamId}_${curr.projectId}`;
        const existing = acc.find(item => item.key === key);
        const userInfo = {
            userId: curr.user?.userId,
            userName: curr.user?.username
        };
        if (existing) {
            if (!existing.userIds.includes(curr.user?.userId)) {
                existing.userIds.push(curr.user?.userId);
                existing.users.push(userInfo);
            }
        }
        else {
            acc.push({
                key,
                id: curr.id,
                userIds: [curr.user?.userId],
                teamId: curr.teamId,
                projectId: curr.projectId,
                team: {
                    teamId: curr.team?.teamId,
                    teamName: curr.team?.teamName,
                    teamLead: curr.team?.teamLead,
                    projectId: curr.team?.projectId
                },
                project: {
                    projectId: curr.project?.projectId,
                    projectName: curr.project?.projectName,
                    description: curr.project?.description
                },
                users: [userInfo]
            });
        }
        return acc;
    }, []);
    return grouped;
};
exports.getAllTeamUsers = getAllTeamUsers;
