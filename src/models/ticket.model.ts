import { Column, Table, Model, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { ChildTicket } from './childticket.model';

@Table({
  tableName: 'tbl_tickets',
  timestamps: true,
})
export class Ticket extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  description!: string;

  @Column(DataType.STRING)
  teamname!: string;

  @Column(DataType.STRING)
  type!: string;

  @Column(DataType.STRING)
  priority!: string;

  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.STRING)
  reportingmanager!: string;

  @Column(DataType.STRING)
  sprint!: string;

  @Column(DataType.DATE)
  startdate!: Date;

  @Column(DataType.DATE)
  enddate!: Date;

  @Column(DataType.STRING)
  comments!: string;

  @Column(DataType.STRING)
  ownedby!: string;

@Column(DataType.JSON)
attachments!: string[];
@HasMany(() => ChildTicket, { foreignKey: 'parentId', as: 'childTickets' })
childTickets!: ChildTicket[];

  // @HasMany(() => ChildTicket)
  // childTickets!: ChildTicket[];
//   @HasMany(() => ChildTicket, { foreignKey: 'parentId' })
// childTickets!: ChildTicket[];
// @HasMany(() => ChildTicket, { foreignKey: 'parentId', as: 'childTickets' })
// childTickets!: ChildTicket[];

}
