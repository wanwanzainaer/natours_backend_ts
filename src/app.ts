import express, { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: 'Hello world from the server side!!!', app: 'Natours' });
});

app.post('/', (req: Request, res: Response) => {
  res.send('You can post to this end point');
});

const port = 5000;

app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
