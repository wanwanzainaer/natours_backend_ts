import fs from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Tour } from '../../models/tour';
import { User } from '../../models/user';
import { Review } from '../../models/review';
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
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Tour.build(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.build(reviews);

    console.log('Data successful created');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});

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
