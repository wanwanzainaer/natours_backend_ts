import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
// import xss from 'xss-clean';

import { globalErrorHandler } from '../controllers/errorController';
import { tourRouter } from '../routes/tourRoutes';
import { userRouter } from '../routes/userRoutes';
import { AppError } from '../utils/AppError';

const app: express.Application = express();
// 1) GLOBAL MIDDLEWARES
// Security HTTP headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan<Request, Response>('dev'));
}

// Limit request from same IP
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this Ip, please try again in an hour!',
});
app.use('/api', limiter);

// body parse
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
// app.use(xss())

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'maxGroupSize',
      'price',
      'ratingsAverage',
      'difficulty',
    ],
  })
);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//handle the Not found the url handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export { app };
