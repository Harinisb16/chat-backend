import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany
} from 'sequelize-typescript';
import { Team } from './team.model';

@Table({ tableName: 'tbl_project', timestamps: false })
export default class Project extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  projectId!: number;

  @Column(DataType.STRING)
  projectName!: string;

  @Column(DataType.STRING)
  description!: string;

   @HasMany(() => Team)
  teams!: Team[];
}
