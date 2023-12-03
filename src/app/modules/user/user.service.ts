import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.modal';
import { Student } from '../students/students.Model';
import { TStudents } from '../students/students.interface';

import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createStudentIntoDB = async (password: string, payload: TStudents) => {
  //create a user object

  const userData: Partial<TUser> = {};

  // if passwrod is not fiven, use default passwrod

  userData.password = password || (config.default_password as string);

  //   set a student  role

  userData.role = 'student';

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (!admissionSemester) {
    throw new Error('Academic semester not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateStudentId(admissionSemester);

    //   crate a user (transaction -1)
    const newUser = await User.create([userData], { session });

    //   crate a student

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create new user');
    }
    // set id , _id as user
    payload.id = newUser[0]?.id;
    payload.user = newUser[0]?._id; //reference _id
    // create a new student (transaciton -2)
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create new Student',
      );
    }

    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
  }
};

export const UserServices = {
  createStudentIntoDB,
};
