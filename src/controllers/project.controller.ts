import { Request, Response } from 'express';
import Project from '../models/project.model';
import { Team } from '../models/team.model';
import User from '../models/user.model';

export const createProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: 'Error creating project' });
  }
};

export const getAllProjects = async (_: Request, res: Response) => {
  try {
    const projects = await Project.findAll({ include: [Team] });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching projects' });
  }
};

// export const getProjectById = async (req: Request, res: Response) => {
//   try {
//     const project = await Project.findByPk(req.params.id, { include: [Team] });
//     if (!project) return res.status(404).json({ error: 'Project not found' });
//     res.status(200).json(project);
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching project' });
//   }
// };

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: Team,
          include: [User], // 👈 include users inside teams
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(project);
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ error: "Error fetching project" });
  }
}

export const updateProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    await project.update(req.body);
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: 'Error updating project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    await project.destroy();
    res.status(200).json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting project' });
  }
};
