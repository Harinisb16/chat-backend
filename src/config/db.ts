import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
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
console.log("DB NAME:", process.env.DB_NAME);

export const sequelize = new Sequelize(
  process.env.DATABASE_URL as string,
  {
    dialect: "postgres",
    protocol: "postgres",

    models: [
      Login,
      Role,
      User,
      Sprint,
      Ticket,
      Team,
      TeamUser,
      Project,
      ChildTicket,
      TeamLead,
      UserRole,
      Signup,
    ],

    logging: false,

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);
