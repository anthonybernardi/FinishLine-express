import { Prisma } from '@prisma/client';
import {
  calculateEndDate,
  calculatePercentExpectedProgress,
  calculateTimelineStatus,
  WorkPackage
} from 'shared';
import { convertStatus, descBulletConverter, wbsNumOf } from './utils';

export const wpQueryArgs = Prisma.validator<Prisma.Work_PackageArgs>()({
  include: {
    wbsElement: {
      include: {
        projectLead: true,
        projectManager: true,
        changes: { include: { implementer: true }, orderBy: { dateImplemented: 'asc' } }
      }
    },
    expectedActivities: true,
    deliverables: true,
    dependencies: true
  }
});

export const workPackageTransformer = (
  wpInput: Prisma.Work_PackageGetPayload<typeof wpQueryArgs>
) => {
  const expectedProgress = calculatePercentExpectedProgress(
    wpInput.startDate,
    wpInput.duration,
    wpInput.wbsElement.status
  );
  const wbsNum = wbsNumOf(wpInput.wbsElement);
  return {
    id: wpInput.workPackageId,
    dateCreated: wpInput.wbsElement.dateCreated,
    name: wpInput.wbsElement.name,
    orderInProject: wpInput.orderInProject,
    progress: wpInput.progress,
    startDate: wpInput.startDate,
    duration: wpInput.duration,
    expectedActivities: wpInput.expectedActivities.map(descBulletConverter),
    deliverables: wpInput.deliverables.map(descBulletConverter),
    dependencies: wpInput.dependencies.map(wbsNumOf),
    projectManager: wpInput.wbsElement.projectManager ?? undefined,
    projectLead: wpInput.wbsElement.projectLead ?? undefined,
    status: convertStatus(wpInput.wbsElement.status),
    wbsNum,
    endDate: calculateEndDate(wpInput.startDate, wpInput.duration),
    expectedProgress,
    timelineStatus: calculateTimelineStatus(wpInput.progress, expectedProgress),
    changes: wpInput.wbsElement.changes.map((change) => ({
      wbsNum,
      changeId: change.changeId,
      changeRequestId: change.changeRequestId,
      implementer: change.implementer,
      detail: change.detail,
      dateImplemented: change.dateImplemented
    }))
  } as WorkPackage;
};
