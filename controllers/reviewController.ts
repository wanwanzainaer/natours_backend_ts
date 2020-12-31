import { NextFunction, Response, Request } from 'express';
import { Review } from '../models/review';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequestUser } from '../controllers/authController';
export const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const reviews = await Review.find(filter);

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: {
        reviews,
      },
    });
  }
);
export const createReview = catchAsync(
  async (req: AuthRequestUser, res: Response, next: NextFunction) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user!.id;

    const newReview = await Review.build(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        review: newReview,
      },
    });
  }
);
// export const getAllReviews = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {}
// );
// export const getAllReviews = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {}
// );
// export const getAllReviews = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {}
// );
