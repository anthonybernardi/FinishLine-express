import prisma from '../prisma/prisma';
import { isProject, validateWBS, WbsNumber } from 'shared';
import {
  getChangeRequestReviewState,
  getHighestProjectNumber,
  manyRelationArgs,
  projectTransformer,
  uniqueRelationArgs
} from '../utils/projects.utils';
import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import { validationResult } from 'express-validator';

export const getAllProjects = async (_req: Request, res: Response) => {
  const projects = await prisma.project.findMany(manyRelationArgs);
  res.status(200).json(projects.map(projectTransformer));
};

export const getSingleProject = async (req: Request, res: Response) => {
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

export const newProject = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // verify user is allowed to create projects
  const user = await prisma.user.findUnique({ where: { userId: req.body.userId } });
  if (!user) return res.status(404).json({ message: `user #${req.body.userId} not found!` });
  if (user.role === Role.GUEST) return res.status(401).json({ message: 'Access Denied' });

  // check if the change request exists
  const crReviewed = await getChangeRequestReviewState(req.body.crId);
  if (crReviewed === null) {
    return res.status(404).json({ message: `change request CR #${req.body.crId}` });
  }
  if (!crReviewed) {
    return res.status(400).json({ message: 'Cannot implement an unreviewed change request' });
  }

  // create the wbs element for the project and document the implemented change request
  const maxProjectNumber = await getHighestProjectNumber(req.body.carNumber);
  const createdProject = await prisma.wBS_Element.create({
    data: {
      carNumber: req.body.carNumber,
      projectNumber: maxProjectNumber + 1,
      workPackageNumber: 0,
      name: req.body.name,
      project: { create: { summary: req.body.summary } },
      changes: {
        create: {
          changeRequestId: req.body.crId,
          implementerId: req.body.userId,
          detail: 'New Project Created'
        }
      }
    },
    include: { project: true, changes: true }
  });

  return res.status(200).json({
    wbsNumber: {
      carNumber: createdProject.carNumber,
      projectNumber: createdProject.projectNumber,
      workPackageNumber: createdProject.workPackageNumber
    }
  });
};
