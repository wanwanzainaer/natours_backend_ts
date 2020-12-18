import { NextFunction, Request, Response } from 'express';
import { Tour } from '../models/tour';

export const getAllTours = async (req: Request, res: Response) => {
  try {
    const tours = await Tour.find({});
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

export const getTour = async (req: Request, res: Response) => {
  // + can convert string to int
  const id: string = req.params.id;
  try {
    const tour = await Tour.findById(id);
    if (!tour)
      return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
  // if (!tour) {
  //   return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  // }
};

export const updateTour = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

export const createTour = async (req: Request, res: Response) => {
  const { name, rating, price } = req.body;
  try {
    const tour = await Tour.build({ name, rating, price });
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};
export const deleteTour = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await Tour.findByIdAndDelete(id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
