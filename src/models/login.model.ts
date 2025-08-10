import {
  Table, Column, Model, PrimaryKey, AutoIncrement,
  DataType, Unique, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { UserRole } from './userrole.model';

@Table({
  tableName: 'tbl_login',
  timestamps: false,
})
export class Login extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  username!: string;

  @Unique
  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  password!: string;

  @ForeignKey(() => UserRole)
  @Column(DataType.INTEGER)
  roleId!: number;

  @BelongsTo(() => UserRole)
  role!: UserRole;
}

export default [Login];
