import express from 'express';
import {
  getAllChangeRequests,
  getChangeRequestByID
} from '../controllers/change-requests.controllers';

const changeRequestsRouter = express.Router();

changeRequestsRouter.get('/', getAllChangeRequests);
changeRequestsRouter.get('/:crId', getChangeRequestByID);

export default changeRequestsRouter;
