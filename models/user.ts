import crypto from 'crypto';
import mongoose, { Query } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface UserAttrs {
  name: string;
  email: string;
  photo?: string;
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt?: Date;
}

export interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  photo?: string;
  password: string;
  role?: string;
  passwordConfirm: string | undefined;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active?: boolean;
  correctPassword(password: string, hash: string): boolean;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const Schema = mongoose.Schema;

const userShcema = new Schema(
  {
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
    role: {
      type: String,
      enum: ['user', 'guide', 'admin', 'lead-guide'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'A User must have password to save user account safty'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please Confirm your password'],
      validate: {
        // this only work on CREATE and SAVE!!!
        validator: function (this: UserDoc, el: string): boolean {
          return this.password === el;
        },
        message: 'Password are not the same!',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

userShcema.pre<UserDoc>('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // hash the original password and save it
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userShcema.pre<UserDoc>('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date();
  next();
});

userShcema.pre<Query<UserDoc[], UserDoc>>(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next(null);
});

userShcema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userShcema.methods.changedPasswordAfter = function (
  this: UserDoc,
  JWTTimestamp: number
) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};
userShcema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.pseudoRandomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userShcema.statics.build = (attrs: UserAttrs) => {
  return User.create(attrs);
};

export const User = mongoose.model<UserDoc, UserModel>('User', userShcema);
