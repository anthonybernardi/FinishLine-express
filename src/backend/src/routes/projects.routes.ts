import express from 'express';
import { getAllProjects, getSingleProject } from '../controllers/projects.controllers';

const projectRouter = express.Router();

projectRouter.get('/', getAllProjects);
projectRouter.get('/:wbsNum', getSingleProject);

export default projectRouter;
