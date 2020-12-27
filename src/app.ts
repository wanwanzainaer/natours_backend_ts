import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { globalErrorHandler } from '../controllers/errorController';
import { tourRouter } from '../routes/tourRoutes';
import { userRouter } from '../routes/userRoutes';
import { AppError } from '../utils/AppError';
import rateLimit from 'express-rate-limit';

const app: express.Application = express();
// 1) GLOBAL MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan<Request, Response>('dev'));
}
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this Ip, please try again in an hour!',
});
app.use('/api', limiter);

app.use(express.json());

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//handle the Not found the url handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export { app };
