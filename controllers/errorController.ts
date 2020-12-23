import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import { AppError } from '../utils/AppError';

const handleValidationErrorDB = (err: AllError) => {
  // const errors = Object.values(err.errors).map(el => el.message)

  // const message = `Invalid input data. ${errors}`;
  const message = `Invalid input data.`;

  return new AppError(message, 400);
};

// Error type is problem
const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational Error by user make mistake, so it will return to user
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //Programming or other unknown error; don't leak error details
  } else {
    // 1) Log error
    console.error('Error ', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

const handleDuplicateFieldsDB = (err: AllError) => {
  const value = err.errmsg!.match(/(["'])(?:(?=(\\?))\2.)*?\1/)![0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError('message', 400);
};

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

type MongoExtError = Optional<MongoError, 'hasErrorLabel' | 'errorLabels'>;
type AllError = AppError & MongoExtError;

export const globalErrorHandler = (
  err: AllError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    sendErrorDev(err, res);
  }
};
