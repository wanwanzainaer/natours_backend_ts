import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { tourRouter } from '../routes/tourRoutes';
import { userRouter } from '../routes/userRoutes';

const app: express.Application = express();
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan<Request, Response>('dev'));
}
app.use(express.json());

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//handle the Not found the url handler
app.all('*', (req, res, next) => {
  res
    .status(404)
    .json({
      status: 'fail',
      message: `Can't find ${req.originalUrl} on this server`,
    });
});

export { app };
