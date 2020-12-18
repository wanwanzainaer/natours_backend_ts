import { NextFunction, Request, Response } from 'express';
import { TourAttrs, Tour } from '../models/tour';

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

export const createTour = async (
  // for update to the req.body have the type
  req: Request<{}, {}, TourAttrs>,
  res: Response
) => {
  try {
    const tour = await Tour.build({ ...req.body });
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
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
