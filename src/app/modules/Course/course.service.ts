/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './course.constant';
import { TCourse, TCourseFaculty } from './course.interface';
import { Course, CourseFaculty } from './course.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createCoruseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};
const getAllCoursesFromBD = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisitecourses.course'),
    query,
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await courseQuery.modelQuery;
  return result;
};
const getSingleCourseFromBD = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisitecourses.course',
  );
  return result;
};

const updateCourseIntoBD = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisitecourses, ...courseRemainigData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // setp1: basic Course info update
    const updateBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainigData,
      { new: true, runValidators: true, session },
    );

    if (!updateBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_GATEWAY, 'Failed to Update Course');
    }
    // check if there is any prerequisite courses to update

    if (preRequisitecourses && preRequisitecourses.length > 0) {
      // fiter out the deleted course fields
      const deletedPreRequisites = preRequisitecourses
        .filter(el => el.course && el.isDeleted)
        .map(el => el.course);

      const deletedPreRequisitesCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisitecourses: { course: { $in: deletedPreRequisites } },
          },
        },
        { new: true, runValidators: true, session },
      );

      if (!deletedPreRequisitesCourses) {
        throw new AppError(httpStatus.BAD_GATEWAY, 'Failed to Delete Course');
      }
      //
      // fiter out the new Coruse fields
      const newPreRequisites = preRequisitecourses?.filter(
        el => el.course && !el.isDeleted,
      );

      const newPreRequisitesCoruse = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisitecourses: { $each: newPreRequisites } },
        },
        { new: true, runValidators: true, session },
      );
      if (!newPreRequisitesCoruse) {
        throw new AppError(httpStatus.BAD_GATEWAY, 'Failed to Update Course');
      }

      const reslut = await Course.findById(id).populate(
        'preRequisitecourses.course',
      );

      return reslut;
    }
    await session.commitTransaction();
    await session.endSession();
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Update Course');
  }
};
const deleteCourseIntoBD = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    { upsert: true, new: true },
  );
  return result;
};
const removeFacultiesWithCourseFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
    
      $pull: {faculties: {$in: payload  }}
    },
    { new: true },
  );
  return result;
};
export const CourseServices = {
  createCoruseIntoDB,
  getAllCoursesFromBD,
  getSingleCourseFromBD,
  updateCourseIntoBD,
  deleteCourseIntoBD,
  assignFacultiesWithCourseIntoDB,
  removeFacultiesWithCourseFromDB
};
