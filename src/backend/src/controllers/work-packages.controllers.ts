import prisma from '../prisma/prisma';
import { Request, Response } from 'express';
import { workPackageTransformer, wpQueryArgs } from '../utils/work-packages.utils';
import { isProject, validateWBS, WbsNumber } from 'shared';
import { Role, WBS_Element } from '@prisma/client';
import { getChangeRequestReviewState } from '../utils/projects.utils';

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

export const createWorkPackage = async (req: Request, res: Response) => {
  const { body } = req;
  const {
    projectWbsNum,
    name,
    crId,
    userId,
    startDate,
    duration,
    dependencies,
    expectedActivities,
    deliverables
  } = body;

  // verify user is allowed to create work packages
  const user = await prisma.user.findUnique({ where: { userId } });
  if (!user) return res.status(404).json({ message: `user with id #${userId} not found!` });
  if (user.role === Role.GUEST) return res.status(401).json({ message: 'Access Denied' });

  const crReviewed = await getChangeRequestReviewState(crId);
  if (crReviewed === null) {
    return res.status(404).json({ message: `change request with id #${crId} not found!` });
  }
  if (!crReviewed) {
    return res.status(400).json({ message: 'Cannot implement an unreviewed change request' });
  }

  // get the corresponding project so we can find the next wbs number
  // and what number work package this should be
  const { carNumber, projectNumber, workPackageNumber } = projectWbsNum;

  if (workPackageNumber !== 0) throw new TypeError('Given WBS Number is not for a project.');

  const wbsElem = await prisma.wBS_Element.findUnique({
    where: {
      wbsNumber: {
        carNumber,
        projectNumber,
        workPackageNumber
      }
    },
    include: {
      project: {
        include: {
          workPackages: { include: { wbsElement: true, dependencies: true } }
        }
      }
    }
  });

  if (wbsElem === null) {
    return res
      .status(404)
      .json({ message: `Could not find element with wbs number: ${projectWbsNum.toString()}` });
  }

  const { project } = wbsElem;

  if (project === null) {
    return res.status(404).json({ message: `Could not find project from given wbs number!` });
  }
  const { projectId } = project;

  const newWorkPackageNumber: number =
    project.workPackages
      .map((element) => element.wbsElement.workPackageNumber)
      .reduce((prev, curr) => Math.max(prev, curr), 0) + 1;

  const dependenciesWBSElems: (WBS_Element | null)[] = await Promise.all(
    dependencies.map(async (ele: any) => {
      return await prisma.wBS_Element.findUnique({
        where: {
          wbsNumber: {
            carNumber: ele.carNumber,
            projectNumber: ele.projectNumber,
            workPackageNumber: ele.workPackageNumber
          }
        }
      });
    })
  );

  const dependenciesIds = dependenciesWBSElems.map((elem) => {
    if (elem === null) throw new TypeError('One of the dependencies was not found.');
    return elem.wbsElementId;
  });

  // add to the database
  await prisma.work_Package.create({
    data: {
      wbsElement: {
        create: {
          carNumber,
          projectNumber,
          workPackageNumber: newWorkPackageNumber,
          name,
          changes: {
            create: {
              changeRequestId: crId,
              implementerId: userId,
              detail: 'New Work Package Created'
            }
          }
        }
      },
      project: { connect: { projectId } },
      startDate: new Date(startDate),
      duration,
      orderInProject: project.workPackages.length + 1,
      dependencies: { connect: dependenciesIds.map((ele) => ({ wbsElementId: ele })) },
      expectedActivities: { create: expectedActivities.map((ele: string) => ({ detail: ele })) },
      deliverables: { create: deliverables.map((ele: string) => ({ detail: ele })) }
    }
  });

  return res.status(200).json({ message: 'Work Package Created' });
};
