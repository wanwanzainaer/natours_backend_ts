import mongoose, { Query, Aggregate } from 'mongoose';
import slugify from 'slugify';
import { UserDoc } from './user';
export interface TourAttrs {
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  slug?: string;
  priceDiscount: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: Date[];
  secretTour: boolean;
  startLocation?: {
    type: string;
    description: string;
    coordinates: [number];
    address: string;
  };
  location?: [
    {
      type: string;
      coordinates: [number];
      address: string;
      description: string;
      day: number;
    }
  ];
}

// interface TourAttrs {
//   name: string;
//   rating: number;
//   price: number;
// }

export interface TourDoc extends mongoose.Document {
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  slug?: string;
  priceDiscount: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: Date[];
  secretTour: boolean;
  startLocation?: {
    type: string;
    description: string;
    coordinates: [number];
    address: string;
  };
  location?: [
    {
      type: string;
      coordinates: [number];
      address: string;
      description: string;
      day: number;
    }
  ];
}

interface TourModel extends mongoose.Model<TourDoc> {
  build(attrs: TourAttrs): TourDoc;
}
const Schema = mongoose.Schema;

const tourSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    ratingsAverage: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficult is either: easy, medium, difficult',
      },
    },
    slug: { type: String },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (this: TourDoc): boolean {
          return this.priceDiscount < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [{ type: String }],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },

    //typescript
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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
// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

tourSchema.virtual('durationWeeks').get(function (this: TourDoc) {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//Doucument middleware runs before .save() and .create()
tourSchema.pre<TourDoc>('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre<TourDoc>('save', async function (next) {
//   const guidesPromises = this.guides.map((id) => await User.findById(id));
//  this.guides =  await Promise.all(guidesPromises);
//   next(null);
// });
// tourSchema.pre<TourDoc>('save', function (next) {
//   next();
// });

// tourSchema.post<TourDoc>('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre<Query<TourDoc[], TourDoc>>(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  next(null);
});

// Do the query populate all document
tourSchema.pre<Query<TourDoc[], TourDoc>>(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next(null);
});
// tourSchema.post<Query<TourDoc[], TourDoc>>(/^find/, function (docs, next) {
//   console.log(docs);
//   next(null);
// });

// AGGREGATION MIDDLEWARE

tourSchema.pre<Aggregate<TourDoc>>('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next(null);
});

tourSchema.statics.build = (attrs: TourAttrs) => {
  return Tour.create(attrs);
};

const Tour = mongoose.model<TourDoc, TourModel>('Tour', tourSchema);

export { Tour };
