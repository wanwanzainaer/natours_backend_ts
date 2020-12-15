import express, { Request, Response, NextFunction } from 'express';
import {
  createTour,
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  checkId,
} from '../controllers/tourController';

const tourRouter = express.Router();
tourRouter.param('id', checkId);
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export { tourRouter };
