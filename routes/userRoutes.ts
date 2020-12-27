import express from 'express';
import {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  createUser,
} from '../controllers/userController';

import {
  forgotPassword,
  login,
  resetPassword,
  signup,
} from '../controllers/authController';
const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);

userRouter.post('/forgetPassword', forgotPassword);
userRouter.post('/resetPassword/:resetToken', resetPassword);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export { userRouter };
