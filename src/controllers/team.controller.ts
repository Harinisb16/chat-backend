import { Request, Response } from 'express';
import { Team } from '../models/team.model';
import { TeamUser } from '../models/teamuser.model';
import User from '../models/user.model';
import Project from '../models/project.model';

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
export const assignUsersToTeam = async (req: Request, res: Response) => {
  try {
    const { userIds, teamId, projectId } = req.body;

    if (!userIds || !teamId || !projectId) {
      return res.status(400).json({ message: 'userIds, teamId, and projectId are required' });
    }

    const records = userIds.map((userId: number) => ({
      userId,
      teamId,
      projectId,
    }));

    const createdRecords = await TeamUser.bulkCreate(records);

    res.status(201).json({
      message: 'Users successfully assigned to the team',
      data: createdRecords,
    });
  } catch (error) {
    console.error('Error assigning users to team:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: (error as Error).message // Add this line for clarity
    });
  }
};
export const createTeamWithUsers = async (req: Request, res: Response) => {
  const { teamName, projectId, userIds } = req.body;

  if (!teamName || !projectId || !Array.isArray(userIds)) {
    return res.status(400).json({ message: 'teamName, projectId, and userIds are required' });
  }

  try {
  const existingUsers = await User.findAll({
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
    const team = await Team.create({ teamName, projectId });

    // Assign users
    const teamUserRecords = userIds.map((userId: number) => ({
      userId,
      teamId: team.id,
      projectId,
    }));

    await TeamUser.bulkCreate(teamUserRecords);

    // Return full team with users and project
    const fullTeam = await Team.findByPk(team.id, { include: [Project, User] });

    res.status(201).json({
      message: 'Team created and users assigned successfully',
      team: fullTeam,
    });
  } catch (error) {
    console.error('Error creating team with users:', error);
    res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
  }
};



export const createTeam = async (req: Request, res: Response) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ error: 'Error creating team' });
  }
};

export const getAllTeams = async (_: Request, res: Response) => {
  try {
    const teams = await Team.findAll({ include: [Project, User] });
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching teams' });
  }
};

export const getTeamById = async (req: Request, res: Response) => {
  try {
    const team = await Team.findByPk(req.params.id, { include: [Project, User] });
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching team' });
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    await team.update(req.body);
    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ error: 'Error updating team' });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    await team.destroy();
    res.status(200).json({ message: 'Team deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting team' });
  }
};
