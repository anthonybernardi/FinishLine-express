import express from 'express';
import { getAllWorkPackages, getSingleWorkPackage } from '../controllers/work-packages.controllers';

const workPackagesRouter = express.Router();

workPackagesRouter.get('/', getAllWorkPackages);
workPackagesRouter.get('/:wbsNum', getSingleWorkPackage);

export default workPackagesRouter;
