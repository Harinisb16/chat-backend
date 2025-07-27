import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  DataType,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { Role } from './role.model';
import { TeamUser } from './teamuser.model';
import { Team } from './team.model';

@Table({ tableName: 'tbl_user', timestamps: false })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  userId!: number;

  @Column(DataType.STRING)
  username!: string;

  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  roleId!: number;

  @BelongsTo(() => Role)
  role!: Role;

  @Column(DataType.STRING)
  reportingManager!: string;

  @Column(DataType.STRING)
  project!: string;
  
@BelongsToMany(() => Team, () => TeamUser)
teams!: Team[];

}



export default User;