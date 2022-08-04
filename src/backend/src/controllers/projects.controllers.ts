import prisma from '../prisma/prisma';
import { isProject, validateWBS, WbsNumber } from 'shared';
import { manyRelationArgs, projectTransformer, uniqueRelationArgs } from '../utils/projects.utils';

export const getAllProjects = async (_req: any, res: any) => {
  const projects = await prisma.project.findMany(manyRelationArgs);
  res.status(200).json(projects.map(projectTransformer));
};

export const getSingleProject = async (req: any, res: any) => {
  const parsedWbs: WbsNumber = validateWBS(req.params.wbsNum);

  if (!isProject(parsedWbs)) {
    return res.status(404).json({ message: `${req.params.wbsNum} is not a valid project WBS #!` });
  }

  const wbsEle = await prisma.wBS_Element.findUnique({
    where: {
      wbsNumber: {
        carNumber: parsedWbs.carNumber,
        projectNumber: parsedWbs.projectNumber,
        workPackageNumber: parsedWbs.workPackageNumber
      }
    },
    ...uniqueRelationArgs
  });

  if (wbsEle === null) {
    return res.status(404).json({ message: `project ${req.params.wbsNum} not found!` });
  }

  return res.status(200).json(projectTransformer(wbsEle));
};
