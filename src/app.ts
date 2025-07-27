import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route';
import { sequelize } from './config/db';
import roleRoutes from './routes/role.routes';
import userRoutes from './routes/user.routes';
import sprintRoutes from './routes/sprint.route';
import ticketRoutes from './routes/ticket.route';
import teamRoutes from './routes/team.routes';
import teamuserRoutes from './routes/teamUser.routes';
import childticketRoutes from './routes/childticket.route';

import projectRoutes from './routes/project.routes';
const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sprints', sprintRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/teamuser', teamuserRoutes);
app.use('/api/childticket',childticketRoutes );

sequelize.sync({ alter: true }).then(() => {
  console.log('DB connected');
});

export default app;
