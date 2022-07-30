import express from 'express';
import { getAllProjects } from '../controllers/projects.controllers';

const projectRouter = express.Router();

projectRouter.get('/', getAllProjects);

export default projectRouter;
