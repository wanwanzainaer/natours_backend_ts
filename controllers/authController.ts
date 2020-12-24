import { NextFunction, Response, Request } from 'express';
import { User } from '../models/user';
import { catchAsync } from '../utils/catchAsync';

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.build(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  }
);
