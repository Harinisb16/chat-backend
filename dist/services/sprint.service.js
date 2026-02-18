"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SprintService = void 0;
const sprint_model_1 = require("../models/sprint.model");
class SprintService {
    static async create(data) {
        return await sprint_model_1.Sprint.create(data);
    }
    static async getAll() {
        return await sprint_model_1.Sprint.findAll();
    }
    static async getById(id) {
        return await sprint_model_1.Sprint.findByPk(id);
    }
    static async update(id, data) {
        const sprint = await sprint_model_1.Sprint.findByPk(id);
        if (!sprint)
            return null;
        return await sprint.update(data);
    }
    static async delete(id) {
        const sprint = await sprint_model_1.Sprint.findByPk(id);
        if (!sprint)
            return null;
        await sprint.destroy();
        return sprint;
    }
}
exports.SprintService = SprintService;
