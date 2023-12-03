/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswrodChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// set ' ' after saving passwrodn
userSchema.post('save', function (doc, next) {
  doc.password = ' ';

  next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isStudentExist = await User.findOne(query);
  if (!isStudentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User does not exist!');
  }
  next();
});

export const User = model<TUser>('User', userSchema);
