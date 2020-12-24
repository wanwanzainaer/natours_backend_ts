import jwt from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';
import { User } from '../models/user';
import { catchAsync } from '../utils/catchAsync';

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, passwordConfirm } = req.body;
    const newUser = await User.build({
      name,
      email,
      password,
      passwordConfirm,
    });

    const token = jwt.sign(
      { id: newUser.id },
      process.env.JSON_WEBTOKEN_KEY as jwt.Secret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  }
);
