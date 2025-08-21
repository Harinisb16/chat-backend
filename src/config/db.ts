import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import path from 'path';
import { Login } from '../models/login.model';
import Role from '../models/role.model';
import User from '../models/user.model';
import { Sprint } from '../models/sprint.model';
import { Ticket } from '../models/ticket.model';
import { Team } from '../models/team.model';
import { TeamUser } from '../models/teamuser.model';
import Project from '../models/project.model';
import { ChildTicket } from '../models/childticket.model';
import { TeamLead } from '../models/teamleaddetail.model';
import { UserRole } from '../models/userrole.model';
import { Signup } from '../models/signup.model';


dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
   models: [Login,Role,User,Sprint,Ticket,Team,TeamUser,Project,ChildTicket,TeamLead,UserRole,Signup],
  logging: false,
});
