import mongoose, { Query } from 'mongoose';
import { Tour } from './tour';

const Schema = mongoose.Schema;

export interface ReviewAttrs {
  review: string;
  rating: number;
  tour: string;
  user: string;
}
export interface ReviewDoc extends mongoose.Document {
  review: string;
  rating: number;
  // createdAt: Date;
  tour: string;
  user: string;
}

export interface ReviewQuery extends Query<ReviewDoc, ReviewDoc> {
  r?: ReviewDoc;
}

interface ReviewModel extends mongoose.Model<ReviewDoc> {
  build(attrs: ReviewAttrs): ReviewDoc;
  calcAverageRatings(tourId: string): void;
}

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'A review must have rating'],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong a tour'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong a User'],
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.statics.build = (attrs: ReviewAttrs) => {
  return Review.create(attrs);
};

reviewSchema.pre<Query<ReviewDoc[], ReviewDoc>>(/^find/, function (next) {
  // this.populate({ path: 'tour', select: 'name' }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next(null);
});

reviewSchema.statics.calcAverageRatings = async function (tourId: string) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0)
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
};

reviewSchema.post<ReviewDoc>('save', function () {
  // This point to current review
  // point
  // this.constructor
  Review.calcAverageRatings(this.tour);
});

reviewSchema.pre<ReviewQuery>(/^findOneAnd/, async function (next) {
  this.r = (await this.findOne()) || undefined;
  next(null);
});

reviewSchema.post<ReviewQuery>(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await Review.calcAverageRatings(this.r!.tour);
});

export const Review = mongoose.model<ReviewDoc, ReviewModel>(
  'Review',
  reviewSchema
);
