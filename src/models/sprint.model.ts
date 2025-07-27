// src/models/sprint.model.ts
import { Column, Table, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({ tableName: 'tbl_sprints', timestamps: true })
export class Sprint extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  sprintname!: string;

  @Column(DataType.STRING)
  project!: string;

  @Column(DataType.DATE)
  startdate!: Date;

  @Column(DataType.DATE)
  enddate!: Date;

  @Column(DataType.STRING)
  team!: string;

  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.STRING)
  goal!: string;



}
