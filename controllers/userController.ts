import { NextFunction, Request, Response } from 'express';
import { UserAttrs, User } from '../models/user';
import { catchAsync } from '../utils/catchAsync';
import { APIFeatures } from '../utils/ApiFeatures';

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({});

    res.status(200).json({
      status: 'success',
      result: users.length,
      data: {
        users,
      },
    });
  }
);
export const getUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
export const createUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
export const updateUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
export const deleteUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
