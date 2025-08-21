import {
  Table, Column, Model, PrimaryKey, AutoIncrement,
  DataType, Unique, 
} from 'sequelize-typescript';


@Table({
  tableName: 'tbl_signup',
  timestamps: false,
})
export class Signup extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  firstName!: string;

  @Column(DataType.STRING)
  lastName!: string;

  @Unique
  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  phone!: string;

  @Column(DataType.DATEONLY)
  dob!: Date;

  @Column(DataType.ENUM('Male', 'Female', 'Other'))
  gender!: string;

  @Column(DataType.STRING)  
 photo?: string | null;



  @Column(DataType.STRING)
  password!: string;

}

export default [Signup];