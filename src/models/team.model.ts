import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany
} from 'sequelize-typescript';
import { TeamUser } from './teamuser.model';
import Project from './project.model';
import User from './user.model';

@Table({ tableName: 'tbl_team', timestamps: false })
export class Team extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  teamName!: string;

  @ForeignKey(() => Project)
  @Column
  projectId!: number;

  @BelongsTo(() => Project)
  project!: Project;


  @BelongsToMany(() => User, () => TeamUser)
  users!: User[];
}
