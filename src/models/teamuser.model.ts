import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  DataType
} from 'sequelize-typescript';
import User from './user.model';
import { Team } from './team.model';
import Project from './project.model';
@Table({ tableName: 'tbl_user_teams', timestamps: false })
export class TeamUser extends Model {
  @ForeignKey(() => Team)
  @Column
  teamId!: number;

  @ForeignKey(() => User)
  @Column
  userId!: number;

}

