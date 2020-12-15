import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
const app = express();

interface tour {
  id: number;
  name: string;
  duration: number;
  maxGroupSize: number;
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

app.use(express.json());

app.get('/api/v1/tours', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
app.get('/api/v1/tours/:id', (req: Request, res: Response) => {
  // + can convert string to int
  const id: number = +req.params.id;

  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.patch('/api/v1/tours/:id', (req: Request, res: Response) => {
  const id: number = +req.params.id;
  if (id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Update tour here...>',
    },
  });
});

app.delete('/api/v1/tours/:id', (req: Request, res: Response) => {
  const id: number = +req.params.id;
  if (id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(204).json({ status: 'success', data: null });
});

app.post('/api/v1/tours', (req: Request, res: Response) => {
  const tour = req.body as tour;
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { ...tour, id: newId };
  tours.push(newTour);
  fs.writeFile(
    path.join(__dirname, '../', 'dev-data/data/tours-simple.json'),
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

const port = 5000;

app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
