import { TeamUser } from '../models/teamuser.model';
import User from '../models/user.model';
import { Team } from '../models/team.model';
import Project from '../models/project.model';

export const createTeamUser = async (userIds: number[], teamId: number, projectId: number) => {
  const created = await Promise.all(
    userIds.map((userId) =>
      TeamUser.create({
        userId,
        teamId,
        projectId
      })
    )
  );

  return {
    ids: created.map(item => item.id), // return array of created row IDs
    userIds,
    teamId,
    projectId
  };
};

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


export const getAllTeamUsers = async () => {
  const records = await TeamUser.findAll({
    include: [User, Team, Project],
  });

  const grouped = records.reduce((acc: any[], curr: any) => {
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
    } else {
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
