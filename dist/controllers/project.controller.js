"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getAllProjects = exports.createProject = void 0;
const project_model_1 = __importDefault(require("../models/project.model"));
const team_model_1 = require("../models/team.model");
const user_model_1 = __importDefault(require("../models/user.model"));
const createProject = async (req, res) => {
    try {
        const project = await project_model_1.default.create(req.body);
        res.status(201).json(project);
    }
    catch (err) {
        res.status(500).json({ error: 'Error creating project' });
    }
};
exports.createProject = createProject;
const getAllProjects = async (_, res) => {
    try {
        const projects = await project_model_1.default.findAll({ include: [team_model_1.Team] });
        res.status(200).json(projects);
    }
    catch (err) {
        res.status(500).json({ error: 'Error fetching projects' });
    }
};
exports.getAllProjects = getAllProjects;
// export const getProjectById = async (req: Request, res: Response) => {
//   try {
//     const project = await Project.findByPk(req.params.id, { include: [Team] });
//     if (!project) return res.status(404).json({ error: 'Project not found' });
//     res.status(200).json(project);
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching project' });
//   }
// };
const getProjectById = async (req, res) => {
    try {
        const project = await project_model_1.default.findByPk(req.params.id, {
            include: [
                {
                    model: team_model_1.Team,
                    include: [user_model_1.default],
                },
            ],
        });
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.status(200).json(project);
    }
    catch (err) {
        console.error("Error fetching project:", err);
        res.status(500).json({ error: "Error fetching project" });
    }
};
exports.getProjectById = getProjectById;
const updateProject = async (req, res) => {
    try {
        const project = await project_model_1.default.findByPk(req.params.id);
        if (!project)
            return res.status(404).json({ error: 'Project not found' });
        await project.update(req.body);
        res.status(200).json(project);
    }
    catch (err) {
        res.status(500).json({ error: 'Error updating project' });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const project = await project_model_1.default.findByPk(req.params.id);
        if (!project)
            return res.status(404).json({ error: 'Project not found' });
        await project.destroy();
        res.status(200).json({ message: 'Project deleted' });
    }
    catch (err) {
        res.status(500).json({ error: 'Error deleting project' });
    }
};
exports.deleteProject = deleteProject;
