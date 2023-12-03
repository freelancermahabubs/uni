/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';

import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicfaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
  },

  {
    timestamps: true,
  },
);

academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExixt = await AcademicDepartment.findOne({
    name: this.name,
  });
  if (isDepartmentExixt) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This Department is Alrady Exits!',
    );
  }
  next();
});

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isDepartmentExist = await AcademicDepartment.findOne(query);
  if (!isDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This Department does not exist!');
  }
  next();
});
export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
