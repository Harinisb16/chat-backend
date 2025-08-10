import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';

interface TeamLeadAttributes {
  id?: number;
  reportingManagerName: string;
  email: string;
}

@Table({
  tableName: 'tbl_reportingManager_details',
  timestamps: false,
})
export class TeamLead extends Model<TeamLeadAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'reporting_manager_name',
  })
  reportingManagerName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;
}
