import { PrismaClient } from '@prisma/client';
import { manyRelationArgs, projectTransformer } from '../utils/projects.utils';

const prisma = new PrismaClient();

export const getAllProjects = async (_req: any, res: any) => {
  const projects = await prisma.project.findMany(manyRelationArgs);
  res.status(200).json(projects.map(projectTransformer));
};
