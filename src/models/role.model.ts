import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'tbl_role',
  timestamps: false,
})
export class Role extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  role!: string;

  @HasMany(() => User)
  users!: User[];
}

export default Role;
