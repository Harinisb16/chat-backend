"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getAllProjects = exports.createProject = void 0;
const project_model_1 = __importDefault(require("../models/project.model"));
const createProject = async (data) => {
    return await project_model_1.default.create(data);
};
exports.createProject = createProject;
const getAllProjects = async () => {
    return await project_model_1.default.findAll();
};
exports.getAllProjects = getAllProjects;
const getProjectById = async (projectId) => {
    return await project_model_1.default.findByPk(projectId);
};
exports.getProjectById = getProjectById;
const updateProject = async (projectId, data) => {
    const [updated] = await project_model_1.default.update(data, {
        where: { projectId },
    });
    return updated;
};
exports.updateProject = updateProject;
const deleteProject = async (projectId) => {
    return await project_model_1.default.destroy({
        where: { projectId },
    });
};
exports.deleteProject = deleteProject;
