import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { sequelize } from "./config/db";

import authRoutes from "./routes/auth.route";
import roleRoutes from "./routes/role.routes";
import userroleRoutes from "./routes/userrole.route";
import userRoutes from "./routes/user.routes";
import signupRoutes from "./routes/signup.route";
import sprintRoutes from "./routes/sprint.route";
import ticketRoutes from "./routes/ticket.route";
import teamRoutes from "./routes/team.routes";
import teamleadRoutes from "./routes/teamlead.route";
import teamuserRoutes from "./routes/teamUser.routes";
import childticketRoutes from "./routes/childticket.route";
import aiRoutes from "./routes/aiRoutes";
import projectRoutes from "./routes/project.routes";
import chatRoutes from "./routes/chat.routes";
import adminRoutes from "./routes/admin.routes";
import { processPrompt } from "./services/ollamaService";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

/* =========================
   CORS MUST BE FIRST
========================= */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* =========================
   BODY PARSERS
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC
========================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/userrole", userroleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sprints", sprintRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/teamlead", teamleadRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/teamuser", teamuserRoutes);
app.use("/api/childticket", childticketRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Backend is running ",
  });
});

app.post("/api/ai/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await processPrompt(prompt);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   DB
========================= */
sequelize.sync({ alter: true }).then(() => {
  console.log("DB connected");
});

export default app;
