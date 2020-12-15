import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { tourRouter } from '../routes/tourRoutes';
import { userRouter } from '../routes/userRoutes';

const app: express.Application = express();
// 1) MIDDLEWARES
app.use(morgan<Request, Response>('dev'));
app.use(express.json());

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export { app };
