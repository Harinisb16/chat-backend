"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const login_model_1 = require("../models/login.model");
const role_model_1 = __importDefault(require("../models/role.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const sprint_model_1 = require("../models/sprint.model");
const ticket_model_1 = require("../models/ticket.model");
const team_model_1 = require("../models/team.model");
const teamuser_model_1 = require("../models/teamuser.model");
const project_model_1 = __importDefault(require("../models/project.model"));
const childticket_model_1 = require("../models/childticket.model");
const teamleaddetail_model_1 = require("../models/teamleaddetail.model");
const userrole_model_1 = require("../models/userrole.model");
const signup_model_1 = require("../models/signup.model");
dotenv_1.default.config();
console.log("DB NAME:", process.env.DB_NAME);
exports.sequelize = new sequelize_typescript_1.Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    models: [
        login_model_1.Login,
        role_model_1.default,
        user_model_1.default,
        sprint_model_1.Sprint,
        ticket_model_1.Ticket,
        team_model_1.Team,
        teamuser_model_1.TeamUser,
        project_model_1.default,
        childticket_model_1.ChildTicket,
        teamleaddetail_model_1.TeamLead,
        userrole_model_1.UserRole,
        signup_model_1.Signup,
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
});
