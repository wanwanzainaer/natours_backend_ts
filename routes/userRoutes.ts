import express from 'express';
import {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  createUser,
  updateMe,
  deleteMe,
} from '../controllers/userController';

import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  signup,
  updatePassword,
} from '../controllers/authController';
const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);

userRouter.patch('/updatePassword', protect, updatePassword);
userRouter.post('/forgetPassword', forgotPassword);
userRouter.patch('/resetPassword/:resetToken', resetPassword);

userRouter.patch('/updateMe', protect, updateMe);
userRouter.delete('/deleteMe', protect, deleteMe);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export { userRouter };
