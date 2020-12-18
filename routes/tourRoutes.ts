import express from 'express';
import {
  createTour,
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
} from '../controllers/tourController';

const tourRouter = express.Router();
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export { tourRouter };
