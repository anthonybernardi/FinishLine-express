import express from 'express';
import { getAllProjects, getSingleProject, newProject } from '../controllers/projects.controllers';
import { body } from 'express-validator';

const projectRouter = express.Router();

projectRouter.get('/', getAllProjects);
projectRouter.get('/:wbsNum', getSingleProject);
projectRouter.post(
  '/new',
  body('userId').isInt({ min: 0 }),
  body('crId').isInt({ min: 0 }),
  body('name').not().isEmpty(),
  body('carNumber').isInt({ min: 0 }),
  body('summary').not().isEmpty(),
  newProject
);

export default projectRouter;
