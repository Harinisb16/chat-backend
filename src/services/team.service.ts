import { Team } from '../models/team.model';

export const createTeam = async (data: Partial<Team>) => {
  return await Team.create(data);
};

export const getAllTeams = async () => {
  return await Team.findAll();
};

export const updateTeam = async (id: number, data: Partial<Team>) => {
  await Team.update(data, { where: { teamId: id } });
  return await Team.findByPk(id);
};

export const deleteTeam = async (id: number) => {
  await Team.destroy({ where: { teamId: id } });
};
