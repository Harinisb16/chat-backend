"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./config/db");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const role_routes_1 = __importDefault(require("./routes/role.routes"));
const userrole_route_1 = __importDefault(require("./routes/userrole.route"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const signup_route_1 = __importDefault(require("./routes/signup.route"));
const sprint_route_1 = __importDefault(require("./routes/sprint.route"));
const ticket_route_1 = __importDefault(require("./routes/ticket.route"));
const team_routes_1 = __importDefault(require("./routes/team.routes"));
const teamlead_route_1 = __importDefault(require("./routes/teamlead.route"));
const teamUser_routes_1 = __importDefault(require("./routes/teamUser.routes"));
const childticket_route_1 = __importDefault(require("./routes/childticket.route"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const ollamaService_1 = require("./services/ollamaService");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set("trust proxy", 1);
/* =========================
   CORS MUST BE FIRST
========================= */
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
/* =========================
   BODY PARSERS
========================= */
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
/* =========================
   STATIC
========================= */
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
/* =========================
   ROUTES
========================= */
app.use("/api/auth", auth_route_1.default);
app.use("/api/signup", signup_route_1.default);
app.use("/api/roles", role_routes_1.default);
app.use("/api/userrole", userrole_route_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/sprints", sprint_route_1.default);
app.use("/api/tickets", ticket_route_1.default);
app.use("/api/teams", team_routes_1.default);
app.use("/api/teamlead", teamlead_route_1.default);
app.use("/api/project", project_routes_1.default);
app.use("/api/teamuser", teamUser_routes_1.default);
app.use("/api/childticket", childticket_route_1.default);
app.use("/api/ai", aiRoutes_1.default);
app.use("/api/chat", chat_routes_1.default);
app.use("/admin", admin_routes_1.default);
app.post("/api/ai/ask", async (req, res) => {
    try {
        const { prompt } = req.body;
        const result = await (0, ollamaService_1.processPrompt)(prompt);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
/* =========================
   DB
========================= */
db_1.sequelize.sync({ alter: true }).then(() => {
    console.log("DB connected");
});
exports.default = app;
