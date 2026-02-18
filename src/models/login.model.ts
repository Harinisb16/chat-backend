  import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { UserRole } from "./userrole.model";
import User from "./user.model";

//  Attributes interface
export interface LoginAttributes {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  gender: string;
  photo: string;
  email: string;
  password: string;
  roleId: number;
  userId: number;
}

//  Optional attributes when creating
export interface LoginCreationAttributes
  extends Partial<Omit<LoginAttributes, "id">> {} // id is auto-increment

//  Model
@Table({ tableName: "tbl_login", timestamps: false })
export class Login extends Model<LoginAttributes, LoginCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  username!: string;

  @Column(DataType.STRING)
  firstName!: string;

  @Column(DataType.STRING)
  lastName!: string;

  @Column(DataType.STRING)
  phone!: string;

  @Column(DataType.STRING)
  dob!: string;

  @Column(DataType.STRING)
  gender!: string;

  @Column(DataType.STRING)
  photo!: string;

  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  password!: string;

  @ForeignKey(() => UserRole)
  @Column(DataType.INTEGER)
  roleId!: number;

  @BelongsTo(() => UserRole)
  UserRole?: UserRole;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user?: User;
}

export default Login;
