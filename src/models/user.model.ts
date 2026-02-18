import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  DataType,
  BelongsToMany,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import { Role } from "./role.model";
import { TeamUser } from "./teamuser.model";
import { Team } from "./team.model";

/* 1️⃣ Attributes */
interface UserAttributes {
  userId: number;
  username: string;
  email: string;
  phone?: string;
  roleId: number;
  isOnline: boolean;
  lastLogin?: Date;
  project?: string;
  offlineNotified: boolean;
}

/* 2️⃣ Creation attributes */
interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    "userId" | "isOnline" | "lastLogin" | "project" | "offlineNotified"
  > {}

/* 3️⃣ Model */
@Table({
  tableName: "tbl_user",
  timestamps: false,
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  userId!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  username!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email!: string;

  @Column(DataType.STRING)
  phone?: string;

  /* 🔑 Role relation */
  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, allowNull: false })
  roleId!: number;

  @BelongsTo(() => Role)
  role!: Role;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isOnline!: boolean; 

  @Column(DataType.DATE)
  lastLogin?: Date;

  @Column(DataType.STRING)
  project?: string;

  @BelongsToMany(() => Team, () => TeamUser)
  teams!: Team[];

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  offlineNotified!: boolean;
}

export default User;
