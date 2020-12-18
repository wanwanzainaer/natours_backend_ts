import mongoose from 'mongoose';
// export interface TourAttrs {
//   name: string;
//   duration: number;
//   maxGroupSize: number;
//   difficulty: string;
//   ratingsAverage: number;
//   ratingsQuantity: number;
//   price: number;
//   summary: string;
//   description: string;
//   imageCover: string;
//   images: string[];
//   startDates: Date[];
// }

interface TourAttrs {
  name: string;
  rating: number;
  price: number;
}

interface TourDoc extends mongoose.Document {
  name: string;
  rating: number;
  price: number;
}

interface TourModel extends mongoose.Model<TourDoc> {
  build(attrs: TourAttrs): TourDoc;
}
const Schema = mongoose.Schema;

const tourSchema = new Schema({
  name: { type: String, required: true, unique: true },
  rating: {
    type: String,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

tourSchema.statics.build = (attrs: TourAttrs) => {
  return Tour.create(attrs);
};

const Tour = mongoose.model<TourDoc, TourModel>('Tour', tourSchema);

export { Tour };
