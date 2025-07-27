import Project from '../models/project.model';

export const createProject = async (data: {
  projectName: string;
  description?: string;
}) => {
  return await Project.create(data);
};

export const getAllProjects = async () => {
  return await Project.findAll();
};

export const getProjectById = async (projectId: number) => {
  return await Project.findByPk(projectId);
};

export const updateProject = async (
  projectId: number,
  data: Partial<{ projectName: string; description: string }>
) => {
  const [updated] = await Project.update(data, {
    where: { projectId },
  });
  return updated;
};

export const deleteProject = async (projectId: number) => {
  return await Project.destroy({
    where: { projectId },
  });
};
