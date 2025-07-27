import {
  Table, Column, Model, PrimaryKey, AutoIncrement,
  DataType, Unique
} from 'sequelize-typescript';

@Table({
  tableName: 'tbl_login',
  timestamps: false,
})
export class Login extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Unique
  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  password!: string;
}
export default [Login];