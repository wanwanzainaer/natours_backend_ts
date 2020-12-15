import express from 'express';
import {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  createUser,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export { userRouter };
