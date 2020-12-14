import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
const app = express();

interface tour {
  id: number;
  name: string;
  duration: number;
  maxGroupSize: 25;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: Date[];
}

const tours: tour[] = JSON.parse(
  fs
    .readFileSync(
      path.join(__dirname, '../', 'dev-data/data/tours-simple.json')
    )
    .toString()
);

app.get('/api/v1/tours', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
});

const port = 5000;

app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
