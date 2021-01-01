import { catchAsync } from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError';
import { APIFeatures } from '../utils/ApiFeatures';

export const deleteOne = (Model: mongoose.Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) return next(new AppError('No Document found with that ID', 404));

    res.status(204).json({ status: 'success', data: null });
  });

export const updateOne = (Model: mongoose.Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return next(new AppError('No Document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const createOne = (Model: mongoose.Model<any>) =>
  catchAsync(
    async (
      // for update to the req.body have the type
      req: Request,
      res: Response
    ) => {
      const doc = await Model.create({ ...req.body });
      res.status(201).json({
        status: 'success',
        data: {
          data: doc,
        },
      });
    }
  );

export const getOne = (
  Model: mongoose.Model<any>,
  populateOption?: { path: string; select?: string }
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    let query = Model.findById(id);
    if (populateOption) query = query.populate(populateOption);
    const doc = await query;
    if (!doc) return next(new AppError('No Document found with that ID', 404));
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const getAll = (Model: mongoose.Model<any>) =>
  catchAsync(async (req: Request, res: Response) => {
    // To allow for nested GET reviews on tour (heck)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // EXECUTE QUERY
    const features = new APIFeatures<mongoose.Document>(
      Model.find(filter),
      req.query as { [key: string]: string }
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.FetchData();
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
