import { getAllReviews, createReview } from '../controllers/reviewController';
import { protect, restrictTo } from '../controllers/authController';
import { Router } from 'express';
const reviewRouter = Router({ mergeParams: true });

reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);

export { reviewRouter };
