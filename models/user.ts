import mongoose from 'mongoose';
import validator from 'validator';

interface UserAttrs {
  name: string;
  email: string;
  photo?: string;
  password: string;
  passwordConfirm: string;
}

interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  photo?: string;
  password: string;
  passwordConfirm: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const Schema = mongoose.Schema;

const userShcema = new Schema({
  name: {
    type: String,
    required: [true, 'User must has a name, which can not be empty'],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [
      true,
      'User must has a email which will be account, which can not be empty',
    ],
    validate: [
      validator.isEmail,
      'This email is not valid email, Pleas provide a valid email',
    ],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'A User must have password to save user account safty'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please Confirm your password'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userShcema.statics.build = (attrs: UserAttrs) => {
  return User.create(attrs);
};

export const User = mongoose.model<UserDoc, UserModel>('User', userShcema);
