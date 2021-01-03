import { NextFunction, Request, Response } from 'express';
import { TourAttrs, TourDoc, Tour } from '../models/tour';
import { catchAsync } from '../utils/catchAsync';
import { APIFeatures } from '../utils/ApiFeatures';
import { AppError } from '../utils/AppError';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory';
export const aliasTopTours = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};
// export const getAllTours = catchAsync(async (req: Request, res: Response) => {
//   // BUILD QUERY
//   // 1A) Filtering
//   // const queryObj = { ...req.query };
//   // const excludedFields = ['page', 'sort', 'limit', 'fields'];
//   // excludedFields.forEach((el) => delete queryObj[el]);

//   // // 1B) Advanced filtering
//   // let queryStr = JSON.stringify(queryObj);
//   // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//   // // console.log(JSON.parse(queryStr));
//   // let query = Tour.find(JSON.parse(queryStr));

//   // 2) Sorting
//   // if (req.query.sort) {
//   //   const sortByStr = req.query.sort as string;
//   //   const sortBy = sortByStr.split(',').join(' ');
//   //   query = query.sort(sortBy);
//   // } else {
//   //   query = query.sort('-createdAt');
//   // }

//   // // 3) Field limiting
//   // if (req.query.fields) {
//   //   const fieldsStr = req.query.fields as string;
//   //   const fields = fieldsStr.split(',').join(' ');
//   //   query = query.select(fields);
//   // } else {
//   //   query = query.select('-__v');
//   // }

//   // 4) Pagination
//   //must fixed typescript
//   // let page = req.query.page || 1;
//   // page = +page;
//   // let limit = req.query.limit || 100;
//   // limit = +limit;
//   // const skip = (page - 1) * limit;
//   // query = query.skip(skip).limit(limit);

//   // if (req.query.page) {
//   //   const numTours = await Tour.countDocuments();
//   //   if (skip >= numTours) throw new Error('This page does not exist');
//   // }

//   // EXECUTE QUERY
//   const features = new APIFeatures<TourDoc>(
//     Tour.find(),
//     req.query as { [key: string]: string }
//   )
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.FetchData();
//   // Another approach
//   // const tours = await Tour.find()
//   //   .where('duration')
//   //   .equals(5)
//   //   .where('difficulty')
//   //   .equals('easy');

//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// });
export const getAllTours = getAll(Tour);
export const getTour = getOne(Tour, { path: 'reviews' });
export const updateTour = updateOne(Tour);
export const createTour = createOne(Tour);
export const deleteTour = deleteOne(Tour);

export const getTourStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        num: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

export const getMonthlyPlan = catchAsync(
  async (req: Request, res: Response) => {
    const year = +req.params.year; //2021
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  }
); //
export const getToursWithin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? +distance / 3963.2 : +distance / 6378.1;
    if (!lat || !lng)
      return next(
        new AppError(
          'Please provide latitutr and longitude in the format lat, lng',
          400
        )
      );

    // In GeoJSON lng first and the lat
    const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        data: tours,
      },
    });
  }
);

export const getDistances = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
    if (!lat || !lng)
      return next(
        new AppError(
          'Please provide latitutr and longitude in the format lat, lng',
          400
        )
      );

    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [+lng, +lat],
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        data: distances,
      },
    });
  }
);
