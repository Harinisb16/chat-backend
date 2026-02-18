import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import User from './user.model';
import { Team } from './team.model';

@Table({ tableName: 'tbl_ReportingManager_Detail', timestamps: false })
export class TeamUser extends Model {
  @ForeignKey(() => Team)
  @Column
  teamId!: number;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  // Add this to define the association
  @BelongsTo(() => Team)
  team!: Team;

  @BelongsTo(() => User)
  user!: User;
}
