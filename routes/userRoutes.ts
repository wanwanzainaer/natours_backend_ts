import express from 'express';
import {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  createUser,
  updateMe,
  deleteMe,
  getMe,
} from '../controllers/userController';

import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  signup,
  updatePassword,
} from '../controllers/authController';

import { restrictTo } from '../controllers/authController';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.patch('/resetPassword/:resetToken', resetPassword);
userRouter.post('/forgetPassword', forgotPassword);

userRouter.use(protect);
userRouter.get('/me', getMe, getUser);
userRouter.patch('/updatePassword', protect, updatePassword);
userRouter.patch('/updateMe', updateMe);
userRouter.delete('/deleteMe', deleteMe);

userRouter.use(restrictTo('admin'));
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export { userRouter };
