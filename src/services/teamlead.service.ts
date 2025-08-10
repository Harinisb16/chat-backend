import { CreationAttributes } from 'sequelize';
import { TeamLead } from '../models/teamleaddetail.model';

export class TeamLeadService {
 async createTeamLead(data: CreationAttributes<TeamLead>) {
    return await TeamLead.create(data);
  }

  async getAllTeamLead() {
    return await TeamLead.findAll();
  }

  async getTeamLeadById(id: number) {
    return await TeamLead.findByPk(id);
  }

  async updateTeamLead(
    id: number,
    data: Partial<Pick<TeamLead, 'reportingManagerName' | 'email'>>
  ) {
    const user = await TeamLead.findByPk(id);
    if (!user) throw new Error('User not found');
    return await user.update(data);
  }

  async deleteTeamLead(id: number) {
    const user = await TeamLead.findByPk(id);
    if (!user) throw new Error('TeamLead not found');
    await user.destroy();
    return { message: 'TeamLead deleted successfully' };
  }
}

export const teamleadService = new TeamLeadService();
