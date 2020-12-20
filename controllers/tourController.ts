import { NextFunction, Request, Response } from 'express';
import { Query, Document } from 'mongoose';
import { TourAttrs, TourDoc, Tour } from '../models/tour';

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

class APIFeatures<Doc extends Document> {
  constructor(
    private query: Query<Doc[], Doc>,
    private queryString: { [key: string]: string }
  ) {}
  filter(): this {
    // 1A) Filtering
    const queryObj = { ...this.queryString };
    const excludedFields: string[] = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortByStr = this.queryString.sort as string;
      const sortBy = sortByStr.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      const fieldsStr = this.queryString.fields as string;
      const fields = fieldsStr.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate(): this {
    let page = this.queryString.page || 1;
    page = +page;
    let limit = this.queryString.limit || 100;
    limit = +limit;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
  FetchData(): Query<Doc[], Doc> {
    return this.query;
  }
}

export const getAllTours = async (req: Request, res: Response) => {
  try {
    // BUILD QUERY
    // 1A) Filtering
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // // 1B) Advanced filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // // console.log(JSON.parse(queryStr));
    // let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    // if (req.query.sort) {
    //   const sortByStr = req.query.sort as string;
    //   const sortBy = sortByStr.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // // 3) Field limiting
    // if (req.query.fields) {
    //   const fieldsStr = req.query.fields as string;
    //   const fields = fieldsStr.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // 4) Pagination
    //must fixed typescript
    // let page = req.query.page || 1;
    // page = +page;
    // let limit = req.query.limit || 100;
    // limit = +limit;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('This page does not exist');
    // }

    // EXECUTE QUERY
    const features = new APIFeatures<TourDoc>(
      Tour.find(),
      req.query as { [key: string]: string }
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.FetchData();
    // Another approach
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // SEND RESPONSE
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
