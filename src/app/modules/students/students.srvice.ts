/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { Student } from './students.Model';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import { TStudents } from './students.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  //    const queryObj = { ...query }; //copy
  //   // { email: {$regex: query.searchTerm, $opitons: i}}

  //   const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];
  //   let searchTerm = '';
  //   if (query?.searchTerm) {
  //     searchTerm = query?.searchTerm as string;
  //   }

  //   const searchquery = Student.find({
  //     $or: studentSearchableFields?.map(field => ({
  //       [field]: { $regex: searchTerm, $options: 'i' },
  //     })),
  //   });

  //   // filtering
  //   const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  //   excludeFields.forEach(el => delete queryObj[el]);

  //   const filterQuery = searchquery
  //     .find(queryObj)
  //     .populate('admissionSemester')
  //     .populate({
  //       path: 'academicDepartment',
  //       populate: {
  //         path: 'academicfaculty',
  //       },
  //     });

  //   let sort = '-createdAt';
  //   if (query.sort) {
  //     sort = query.sort as string;
  //   }

  //   const sortQuery = filterQuery.sort(sort);
  //   let page = 1;
  //   let limit = 1;
  //   let skip = 0;
  //   if (query.limit) {
  //     limit = Number(query.limit);
  //   }
  //   if (query.page) {
  //     page = Number(query.page);
  //     skip = (page - 1) * limit;
  //   }
  //   const paginatQuery = sortQuery.skip(skip);

  //   const limitQuery = paginatQuery.limit(limit);

  //   // field limiting

  //   let fields = '-__v';
  //   if (query.fields) {
  //     fields = (query.fields as string).split(',').join('');
  //   }
  //   const fieldQuery = await limitQuery.select(fields);

  //   return fieldQuery;

  // };

  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicfaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await studentQuery.modelQuery;
  return result;
};
const getSingleStudentsFromDB = async (id: string) => {
  // const result = await Students.findOne({ id });
  // Aggregate

  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicfaculty',
      },
    });
  return result;
};
const updateStudentsFromDB = async (
  id: string,
  payload: Partial<TStudents>,
) => {
  const { name, guardian, localGuardian, ...remainigStudentData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainigStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }
  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};
const deleteStudentsFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Faild to Delete Student');
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Faild to Delete User');
    }
    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_GATEWAY, error);
  }
};

export const StudentsServices = {
  getAllStudentsFromDB,
  getSingleStudentsFromDB,
  updateStudentsFromDB,
  deleteStudentsFromDB,
};
