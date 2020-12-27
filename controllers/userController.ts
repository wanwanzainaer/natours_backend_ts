import { NextFunction, Request, Response } from 'express';
import { UserAttrs, User } from '../models/user';
import { catchAsync } from '../utils/catchAsync';
import { APIFeatures } from '../utils/ApiFeatures';
import { AppError } from '../utils/AppError';
import { AuthRequestUser } from './authController';

const filterObj = (
  obj: { [key: string]: string },
  ...allowedFileds: string[]
) => {
  const newObj: { [key: string]: string } = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFileds.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

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

export const updateMe = catchAsync(
  async (req: AuthRequestUser, res: Response, next: NextFunction) => {
    const { password, passwordConfirm } = req.body;
    // 1) Create error if user  POSTs password data
    if (password || passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password update. Please use / updateMyPassword',
          400
        )
      );
    }
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user!.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ status: 'success', data: { user: updatedUser } });
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
