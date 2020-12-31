import { NextFunction, Response, Request } from 'express';
import { Review } from '../models/review';
import { catchAsync } from '../utils/catchAsync';

export const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await Review.find();

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
  async (req: Request, res: Response, next: NextFunction) => {
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
