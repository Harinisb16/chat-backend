"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sprintController = exports.SprintController = void 0;
const sprint_service_1 = require("../services/sprint.service");
class SprintController {
    async create(req, res) {
        try {
            const sprint = await sprint_service_1.SprintService.create(req.body);
            res.status(201).json(sprint);
        }
        catch (err) {
            res.status(500).json({ message: 'Error creating sprint', error: err });
        }
    }
    async getAll(req, res) {
        const sprints = await sprint_service_1.SprintService.getAll();
        res.json(sprints);
    }
    async getById(req, res) {
        const id = parseInt(req.params.id);
        const sprint = await sprint_service_1.SprintService.getById(id);
        if (!sprint)
            return res.status(404).json({ message: 'Sprint not found' });
        res.json(sprint);
    }
    async update(req, res) {
        const id = parseInt(req.params.id);
        const sprint = await sprint_service_1.SprintService.update(id, req.body);
        if (!sprint)
            return res.status(404).json({ message: 'Sprint not found' });
        res.json(sprint);
    }
    async delete(req, res) {
        const id = parseInt(req.params.id);
        const sprint = await sprint_service_1.SprintService.delete(id);
        if (!sprint)
            return res.status(404).json({ message: 'Sprint not found' });
        res.json({ message: 'Sprint deleted' });
    }
}
exports.SprintController = SprintController;
exports.sprintController = new SprintController();
