import prisma from '../prisma/prisma';
import { Request, Response } from 'express';
import { workPackageTransformer, wpQueryArgs } from '../utils/work-packages.utils';
import { isProject, validateWBS, WbsNumber } from 'shared';

// Fetch all work packages, optionally filtered by query parameters
export const getAllWorkPackages = async (req: Request, res: Response) => {
  const { query } = req;
  const workPackages = await prisma.work_Package.findMany(wpQueryArgs);
  const outputWorkPackages = workPackages.map(workPackageTransformer).filter((wp) => {
    let passes = true;
    if (query.status) passes &&= wp.status === query.status;
    if (query.timelineStatus) passes &&= wp.timelineStatus === query.timelineStatus;
    if (query.daysUntilDeadline) {
      const daysToDeadline = Math.round((wp.endDate.getTime() - new Date().getTime()) / 86400000);
      passes &&= daysToDeadline <= parseInt(query?.daysUntilDeadline as string);
    }
    return passes;
  });
  outputWorkPackages.sort((wpA, wpB) => wpA.endDate.getTime() - wpB.endDate.getTime());
  return res.status(200).json(outputWorkPackages);
};

// Fetch the work package for the specified WBS number
export const getSingleWorkPackage = async (req: Request, res: Response) => {
  const parsedWbs: WbsNumber = validateWBS(req.params.wbsNum);
  if (isProject(parsedWbs)) {
    return res
      .status(400)
      .json({ message: 'WBS Number is a project WBS#, not a Work Package WBS#' });
  }
  const wp = await prisma.work_Package.findFirst({
    where: {
      wbsElement: {
        carNumber: parsedWbs.carNumber,
        projectNumber: parsedWbs.projectNumber,
        workPackageNumber: parsedWbs.workPackageNumber
      }
    },
    ...wpQueryArgs
  });

  if (!wp)
    return res
      .status(404)
      .json({ message: `work package with wbs num ${req.params.wbsNum} not found!` });

  return res.status(200).json(workPackageTransformer(wp));
};
