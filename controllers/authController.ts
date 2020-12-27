import jwt, { Secret, SignOptions, verify } from 'jsonwebtoken';
import { promisify } from 'util';
import { NextFunction, Response, Request, request } from 'express';
import { UserDoc, User, UserAttrs } from '../models/user';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { sendEmail } from '../utils/email';

interface AuthRequestUser extends Request {
  user?: UserDoc;
}

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signup = catchAsync(
  async (req: AuthRequestUser, res: Response, next: NextFunction) => {
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

export const protect = catchAsync(
  async (req: AuthRequestUser, res: Response, next: NextFunction) => {
    // 1) Getting token and check of it's there
    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token)
      return next(
        new AppError('You are not login, please log in to get access', 401)
      );
    // 2) Verification token

    const decodeToken = await promisify<string, Secret, any>(verify)(
      token,
      process.env.JWT_SECRET!
    );
    const { id, iat } = decodeToken as { id: string; iat: number };

    // 3) Check if user still exists
    const currentUser = await User.findById(id);
    if (!currentUser)
      return next(
        new AppError(
          'The user beloning to this token does no longer exists',
          401
        )
      );
    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(iat))
      return next(
        new AppError('User recently changed password! Please log in again', 401)
      );

    req.user = currentUser;
    next();
  }
);

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequestUser, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role!)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email });
    if (!user)
      return next(new AppError('There is no user with email address', 404));
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? submit a Patch request with your new password and passwordConirm to:${resetURL}.\n 
                      If you didn't forget your password, please ignore this email!`;
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError(
          'There was an error sending the email. Try again later',
          500
        )
      );
    }
  }
);

export const resetPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
