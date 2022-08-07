import express from 'express';
import { body } from 'express-validator';
import {
  createWorkPackage,
  getAllWorkPackages,
  getSingleWorkPackage
} from '../controllers/work-packages.controllers';

const workPackagesRouter = express.Router();

workPackagesRouter.get('/', getAllWorkPackages);
workPackagesRouter.get('/:wbsNum', getSingleWorkPackage);
workPackagesRouter.post(
  '/create',
  body('userId').isInt({ min: 0 }),
  body('crId').isInt({ min: 0 }),
  body('name').not().isEmpty(),
  body('projectWbsNum.carNumber').isInt({ min: 0 }),
  body('projectWbsNum.projectNumber').isInt({ min: 0 }),
  body('projectWbsNum.workPackageNumber').isInt({ min: 0 }),
  body('startDate').isDate(),
  body('duration').isInt({ min: 0 }),
  body('dependencies.*.carNumber').isInt({ min: 0 }),
  body('dependencies.*.projectNumber').isInt({ min: 0 }),
  body('dependencies.*.workPackageNumber').isInt({ min: 0 }),
  body('expectedActivities').isArray(),
  body('expectedActivities.*').isString(),
  body('expectedActivities.*').not().isEmpty(),
  body('deliverables').isArray(),
  body('deliverables.*').isString(),
  body('deliverables.*').not().isEmpty(),
  createWorkPackage
);

export default workPackagesRouter;
