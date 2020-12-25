import jwt from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';
import { User, UserAttrs } from '../models/user';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, passwordConfirm } = req.body;
    const newUser = await User.build({
      name,
      email,
      password,
      passwordConfirm,
    });
    if (!newUser) return;
    const token = signToken(newUser.id!);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  }
);

export const login = catchAsync(
  async (
    req: Request<{}, {}, UserAttrs>,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password)
      return next(new AppError('Must provide email and password', 400));
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password)))
      return next(new AppError('Can not find user by the email', 401));

    // 3) if everything ok ,send token to client
    const token = signToken(user.id!);
    res.status(200).json({
      status: 'success',
      token,
    });
  }
);
