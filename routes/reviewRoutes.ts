import {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserId,
  getReview,
} from '../controllers/reviewController';
import { protect, restrictTo } from '../controllers/authController';
import { Router } from 'express';
const reviewRouter = Router({ mergeParams: true });

reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourUserId, createReview);

reviewRouter
  .route('/:id')
  .delete(deleteReview)
  .patch(updateReview)
  .get(getReview);

export { reviewRouter };
