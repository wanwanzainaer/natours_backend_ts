import mongoose, { Query } from 'mongoose';

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

interface ReviewModel extends mongoose.Model<ReviewDoc> {
  build(attrs: ReviewAttrs): ReviewDoc;
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

export const Review = mongoose.model<ReviewDoc, ReviewModel>(
  'Review',
  reviewSchema
);
