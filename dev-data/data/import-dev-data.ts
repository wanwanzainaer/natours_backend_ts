import fs from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Tour } from '../../models/tour';

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
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.build(tours);
    console.log('Data successful created');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany({});
    console.log('Data successful delete');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
