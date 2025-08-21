import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route';
import { sequelize } from './config/db';
import roleRoutes from './routes/role.routes';
import userroleRoutes from './routes/userrole.route';
import userRoutes from './routes/user.routes';
import signupRoutes from './routes/signup.route';
import sprintRoutes from './routes/sprint.route';
import ticketRoutes from './routes/ticket.route';
import teamRoutes from './routes/team.routes';
import teamleadRoutes from './routes/teamlead.route';
import teamuserRoutes from './routes/teamUser.routes';
import childticketRoutes from './routes/childticket.route';

import projectRoutes from './routes/project.routes';
import path from 'path';
const app = express();

// Parse JSON bodies (application/json)
app.use(express.json());
// Serve the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Parse URL-encoded bodies (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/userrole', userroleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sprints', sprintRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/teamlead', teamleadRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/teamuser', teamuserRoutes);
app.use('/api/childticket',childticketRoutes );

sequelize.sync({ alter: true }).then(() => {
  console.log('DB connected');
});

export default app;
