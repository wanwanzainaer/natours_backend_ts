import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import { app } from './app';

console.log(process.env);
const port = 5000;

app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
