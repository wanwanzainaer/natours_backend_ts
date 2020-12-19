import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config({ path: './config.env' });

import { app } from './app';

const port = process.env.PORT || 5000;

const DB_URI = process.env.DATABASE_URI!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!
);

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB Connection successful');
  });

app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
