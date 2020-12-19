import mongoose from 'mongoose';
export interface TourAttrs {
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: Date[];
}

// interface TourAttrs {
//   name: string;
//   rating: number;
//   price: number;
// }

interface TourDoc extends mongoose.Document {
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: Date[];
}

interface TourModel extends mongoose.Model<TourDoc> {
  build(attrs: TourAttrs): TourDoc;
}
const Schema = mongoose.Schema;

const tourSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  ratingsAverage: {
    type: String,
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
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
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
});

//test
tourSchema.statics.build = (attrs: TourAttrs) => {
  return Tour.create(attrs);
};

const Tour = mongoose.model<TourDoc, TourModel>('Tour', tourSchema);

export { Tour };
