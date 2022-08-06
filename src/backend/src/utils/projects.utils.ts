import { Description_Bullet, Prisma, WBS_Element } from '@prisma/client';
import prisma from '../prisma/prisma';
import {
  WbsNumber,
  Project,
  WbsElementStatus,
  DescriptionBullet,
  calculateEndDate,
  calculatePercentExpectedProgress,
  calculateTimelineStatus
} from 'shared';

export const manyRelationArgs = Prisma.validator<Prisma.ProjectArgs>()({
  include: {
    wbsElement: {
      include: {
        projectLead: true,
        projectManager: true,
        changes: { include: { implementer: true } }
      }
    },
    team: true,
    goals: true,
    features: true,
    otherConstraints: true,
    workPackages: {
      include: {
        wbsElement: {
          include: {
            projectLead: true,
            projectManager: true,
            changes: { include: { implementer: true } }
          }
        },
        dependencies: true,
        expectedActivities: true,
        deliverables: true
      }
    }
  }
});

export const uniqueRelationArgs = Prisma.validator<Prisma.WBS_ElementArgs>()({
  include: {
    project: {
      include: {
        team: true,
        goals: true,
        features: true,
        otherConstraints: true,
        workPackages: {
          include: {
            wbsElement: {
              include: {
                projectLead: true,
                projectManager: true,
                changes: { include: { implementer: true } }
              }
            },
            dependencies: true,
            expectedActivities: true,
            deliverables: true
          }
        }
      }
    },
    projectLead: true,
    projectManager: true,
    changes: { include: { implementer: true } }
  }
});

export const wbsNumOf = (element: WBS_Element): WbsNumber => ({
  carNumber: element.carNumber,
  projectNumber: element.projectNumber,
  workPackageNumber: element.workPackageNumber
});

export const descBulletConverter = (descBullet: Description_Bullet): DescriptionBullet => ({
  id: descBullet.descriptionId,
  detail: descBullet.detail,
  dateAdded: descBullet.dateAdded,
  dateDeleted: descBullet.dateDeleted ?? undefined
});

export const projectTransformer = (
  payload:
    | Prisma.ProjectGetPayload<typeof manyRelationArgs>
    | Prisma.WBS_ElementGetPayload<typeof uniqueRelationArgs>
): Project => {
  if (payload === null) throw new TypeError('WBS_Element not found');
  const wbsElement = 'wbsElement' in payload ? payload.wbsElement : payload;
  const project = 'project' in payload ? payload.project! : payload;
  const wbsNum = wbsNumOf(wbsElement);
  let team = undefined;
  if (project.team) {
    team = {
      teamId: project.team.teamId,
      teamName: project.team.teamName
    };
  }
  const { projectLead, projectManager } = wbsElement;

  return {
    id: project.projectId,
    wbsNum,
    dateCreated: wbsElement.dateCreated,
    name: wbsElement.name,
    status: wbsElement.status as WbsElementStatus,
    projectLead: projectLead ?? undefined,
    projectManager: projectManager ?? undefined,
    changes: wbsElement.changes.map((change) => ({
      changeId: change.changeId,
      changeRequestId: change.changeRequestId,
      wbsNum,
      implementer: change.implementer,
      detail: change.detail,
      dateImplemented: change.dateImplemented
    })),
    team,
    summary: project.summary,
    budget: project.budget,
    gDriveLink: project.googleDriveFolderLink ?? undefined,
    taskListLink: project.taskListLink ?? undefined,
    slideDeckLink: project.slideDeckLink ?? undefined,
    bomLink: project.bomLink ?? undefined,
    rules: project.rules,
    duration: project.workPackages.reduce((prev, curr) => prev + curr.duration, 0),
    goals: project.goals.map(descBulletConverter),
    features: project.features.map(descBulletConverter),
    otherConstraints: project.otherConstraints.map(descBulletConverter),
    workPackages: project.workPackages.map((workPackage) => {
      const endDate = calculateEndDate(workPackage.startDate, workPackage.duration);
      const expectedProgress = calculatePercentExpectedProgress(
        workPackage.startDate,
        workPackage.duration,
        wbsElement.status
      );

      return {
        id: workPackage.workPackageId,
        wbsNum: wbsNumOf(workPackage.wbsElement),
        dateCreated: workPackage.wbsElement.dateCreated,
        name: workPackage.wbsElement.name,
        status: workPackage.wbsElement.status as WbsElementStatus,
        projectLead: workPackage.wbsElement.projectLead ?? undefined,
        projectManager: workPackage.wbsElement.projectManager ?? undefined,
        changes: workPackage.wbsElement.changes.map((change) => ({
          changeId: change.changeId,
          changeRequestId: change.changeRequestId,
          wbsNum: wbsNumOf(workPackage.wbsElement),
          implementer: change.implementer,
          detail: change.detail,
          dateImplemented: change.dateImplemented
        })),
        orderInProject: workPackage.orderInProject,
        progress: workPackage.progress,
        startDate: workPackage.startDate,
        endDate,
        duration: workPackage.duration,
        expectedProgress,
        timelineStatus: calculateTimelineStatus(workPackage.progress, expectedProgress),
        dependencies: workPackage.dependencies.map(wbsNumOf),
        expectedActivities: workPackage.expectedActivities.map(descBulletConverter),
        deliverables: workPackage.deliverables.map(descBulletConverter)
      };
    })
  };
};

// gets the associated change request for creating a project
export const getChangeRequestReviewState = async (crId: number) => {
  const cr = await prisma.change_Request.findUnique({ where: { crId } });

  // returns null if the change request doesn't exist
  // if it exists, return a boolean describing if the change request was reviewed
  return cr ? cr.dateReviewed !== null : cr;
};

// gets highest current project number
export const getHighestProjectNumber = async (carNumber: number) => {
  const maxProjectNumber = await prisma.wBS_Element.aggregate({
    where: { carNumber },
    _max: { projectNumber: true }
  });

  return maxProjectNumber._max.projectNumber ?? 0;
};
