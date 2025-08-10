import { Column, Table, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Ticket } from './ticket.model';

@Table({
  tableName: 'tbl_child_tickets',
  timestamps: true,
})
export class ChildTicket extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  description!: string;

  @Column(DataType.STRING)
  type!: string;

  @Column(DataType.STRING)
  priority!: string;

  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.STRING)
  sprint!: string;

  @Column(DataType.DATE)
  startdate!: Date;

  @Column(DataType.DATE)
  enddate!: Date;
  
  @Column(DataType.STRING)
  reportingmanager!: string;


  @Column(DataType.STRING)
  comments!: string;

  @Column(DataType.STRING)
  ownedby!: string;

  @Column({
  type: DataType.STRING,
  allowNull: true,
})
attachment?: string;


  // @ForeignKey(() => Ticket)
  // @Column(DataType.INTEGER)
  // parentId!: number;

  // @BelongsTo(() => Ticket)
  // parentTicket!: Ticket;

//   @ForeignKey(() => Ticket)
// @Column(DataType.INTEGER)
// parentId!: number;

// @BelongsTo(() => Ticket, { foreignKey: 'parentId' })
// parentTicket!: Ticket;
@ForeignKey(() => Ticket)
@Column(DataType.INTEGER)
parentId!: number;

@BelongsTo(() => Ticket, { foreignKey: 'parentId', as: 'parentTicket' })
parentTicket!: Ticket;

}
