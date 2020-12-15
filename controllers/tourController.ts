import { NextFunction, Request, Response } from 'express';
import { tour } from '../models/tour';
import fs from 'fs';
import path from 'path';

const tours: tour[] = JSON.parse(
  fs
    .readFileSync(
      path.join(__dirname, '../', 'dev-data/data/tours-simple.json')
    )
    .toString()
);

export const getAllTours = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

export const getTour = (req: Request, res: Response) => {
  // + can convert string to int
  const id: number = +req.params.id;

  const tour = tours.find((el) => el.id === id);

  // if (!tour) {
  //   return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  // }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

export const updateTour = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Update tour here...>',
    },
  });
};

export const createTour = (req: Request, res: Response) => {
  const tour = req.body as tour;
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { ...tour, id: newId };
  tours.push(newTour);
  fs.writeFile(
    path.join(__dirname, '../', 'dev-data/data/tours-simple.json'),
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
export const deleteTour = (req: Request, res: Response) => {
  res.status(204).json({ status: 'success', data: null });
};

export const checkId = (
  req: Request,
  res: Response,
  next: NextFunction,
  val: number
) => {
  if (val > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  next();
};
