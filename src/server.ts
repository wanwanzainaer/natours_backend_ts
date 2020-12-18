import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { app } from './app';
dotenv.config({ path: './config.env' });

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
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB Connection successful');
  });

app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
