import express from 'express';
import {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  createUser,
} from '../controllers/userController';

import { login, signup } from '../controllers/authController';
const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export { userRouter };
